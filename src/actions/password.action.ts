"use server";

import { generatePasswordResetToken } from "@/utils/generateToken";
import { sendPasswordResetEmail } from "@/utils/mail";
import { prisma } from "@/utils/prisma";
import { ActionType } from "@/utils/types";
import z from "zod";
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export const forgotPasswordAction = async (
  props: z.infer<typeof forgotPasswordSchema>
): Promise<ActionType> => {
  try {
    const validation = forgotPasswordSchema.safeParse(props);
    if (!validation.success) {
      return {
        success: false,
        message: "Invalid email",
      };
    }
    const { email } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const token = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(email, token.token);
    return {
      success: true,
      message: "Password reset email sent",
    };
  } catch (error) {
    console.log("Error in forgotPasswordAction:", error);
    return {
      success: false,
      message: "Failed to initiate password reset",
    };
  }
};
