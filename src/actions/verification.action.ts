"use server";

import { prisma } from "@/utils/prisma";

export const verifyEmailAction = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });
    if (
      !verificationToken ||
      new Date(verificationToken.expires) < new Date()
    ) {
      return {
        success: false,
        message: "Invalid or expired verification token",
      };
    }
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email },
    });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    console.log("Error verifying email:", error);
    return {
      success: false,
      message: "Email verification failed",
    };
  }
};
