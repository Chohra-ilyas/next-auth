import { randomInt, randomUUID } from "crypto";
import { prisma } from "./prisma";

export const generateVerificationToken = async (email: string) => {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { email },
  });

  if (verificationToken) {
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });
  }

  const newToken = await prisma.verificationToken.create({
    data: {
      email,
      token: randomUUID(),
      expires: new Date(new Date().getTime() + 3600 * 1000 * 2),
    },
  });

  return newToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const resetToken = await prisma.resetPasswordToken.findFirst({
    where: { email },
  });

  if (resetToken) {
    await prisma.resetPasswordToken.delete({
      where: { id: resetToken.id },
    });
  }

  const newToken = await prisma.resetPasswordToken.create({
    data: {
      email,
      token: randomUUID(),
      expires: new Date(new Date().getTime() + 3600 * 1000 * 2),
    },
  });

  return newToken;
};

export const generateTwoStepToken = async (email: string) => {
  const twoStepToken = await prisma.twoStepVerificationToken.findFirst({
    where: { email },
  });

  if (twoStepToken) {
    await prisma.twoStepVerificationToken.delete({
      where: { id: twoStepToken.id },
    });
  }

  const newToken = await prisma.twoStepVerificationToken.create({
    data: {
      email,
      token: randomInt(100000, 1000000).toString(),
      expires: new Date(new Date().getTime() + 3600 * 1000),
    },
  });

  return newToken;
};
