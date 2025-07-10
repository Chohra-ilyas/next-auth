import { randomUUID } from "crypto";
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

