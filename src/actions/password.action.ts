"use server";

import { generatePasswordResetToken } from "@/utils/generateToken";
import { sendPasswordResetEmail } from "@/utils/mail";
import { resetPasswordSchema } from "@/utils/validationSchemas";
import { prisma } from "@/utils/prisma";
import { ActionType } from "@/utils/types";
import * as bcrypt from "bcryptjs";
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

export const resetPasswordAction = async (
  props: z.infer<typeof resetPasswordSchema>,
  token: string
): Promise<ActionType> => {
  try {
    const validation = resetPasswordSchema.safeParse(props);
    if (!validation.success) {
      return {
        success: false,
        message: "Invalid password reset data",
      };
    }
    const { newPassword } = validation.data;
    const resetPasswordToken = await prisma.resetPasswordToken.findUnique({
      where: { token },
    });

    if (
      !resetPasswordToken ||
      new Date(resetPasswordToken.expires) < new Date()
    ) {
      return {
        success: false,
        message: "Invalid or expired password reset token",
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: resetPasswordToken.email },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { email: resetPasswordToken.email },
      data: { password: hashedPassword },
    });
    await prisma.resetPasswordToken.delete({
      where: { token },
    });
    return {
      success: true,
      message: "Your password has been changed successfully",
    };
  } catch (error) {
    console.log("Error in resetPasswordAction:", error);
    return {
      success: false,
      message: "Failed to reset password",
    };
  }
};
