"use server";
import { prisma } from "@/utils/prisma";
import { loginSchema, registerSchema } from "@/utils/validationSchemas";
import z from "zod";
import * as bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import {
  generateTwoStepToken,
  generateVerificationToken,
} from "@/utils/generateToken";
import {
  sendTwoStepVerificationEmail,
  sendVerificationToken,
} from "@/utils/mail";
import { ActionType, LoginType } from "@/utils/types";

export const loginAction = async (
  data: z.infer<typeof loginSchema>
): Promise<LoginType> => {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "invalid credentials" };
  }
  const { email, password, code } = validation.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return { success: false, message: "invalid credentials" };
    }

    if (!user.emailVerified) {
      const verificationToken = await generateVerificationToken(email);
      // send the verification email with the token
      await sendVerificationToken(
        verificationToken.email,
        verificationToken.token
      );
      return {
        success: true,
        message: "we sent you a verification email, please check your inbox",
      };
    }

    if (user.isTwoStepEnabled && user.email) {
      if (code) {
        const twoStepToken = await prisma.twoStepVerificationToken.findFirst({
          where: { email, token: code },
        });

        if (!twoStepToken || new Date(twoStepToken.expires) < new Date()) {
          return {
            success: false,
            message: "Invalid or expired verification code",
          };
        }

        if (twoStepToken.token !== code) {
          return { success: false, message: "Invalid verification code" };
        }

        await prisma.twoStepVerificationToken.delete({
          where: { id: twoStepToken.id },
        });

        const twoStepConfirmation = await prisma.twoStepConfirmation.findFirst({
          where: { userId: user.id },
        });

        if (twoStepConfirmation) {
          await prisma.twoStepConfirmation.delete({
            where: { id: twoStepConfirmation.id },
          });
        }

        await prisma.twoStepConfirmation.create({
          data: { userId: user.id },
        });

      } else {
        const twoStepToken = await generateTwoStepToken(email);
        await sendTwoStepVerificationEmail(
          twoStepToken.email,
          twoStepToken.token
        );
        return {
          success: true,
          message: "Two-step verification code sent to your email",
          twoStep: true,
        };
      }
    }

    await signIn("credentials", {
      email,
      password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password" };
        default:
          return { success: false, message: "An unexpected error occurred" };
      }
    }
  }
  return { success: true, message: "Login successful" };
};

export const registerAction = async (
  data: z.infer<typeof registerSchema>
): Promise<ActionType> => {
  const validation = registerSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "email or password is invalid" };
  }

  const { username, email, password } = validation.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    const verificationToken = await generateVerificationToken(email);
    // send the verification email with the token
    await sendVerificationToken(
      verificationToken.email,
      verificationToken.token
    );

    return { success: true, message: "email sent, verify your email" };
  } catch (error) {
    console.log("Registration error:", error);
    return { success: false, message: "An error occurred during registration" };
  }
};

export const logoutAction = async (): Promise<void> => {
  await signOut();
};

//toggle Two Step
export const toggleTwoStepAction = async (
  userId: string,
  isEnabled: boolean
): Promise<ActionType> => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isTwoStepEnabled: isEnabled },
    });
    return { success: true, message: "Two-Step Verification updated" };
  } catch (error) {
    console.log("Toggle Two-Step error:", error);
    return { success: false, message: "An error occurred while updating" };
  }
};
