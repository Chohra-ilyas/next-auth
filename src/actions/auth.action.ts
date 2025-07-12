"use server";
import { prisma } from "@/utils/prisma";
import { loginSchema, registerSchema } from "@/utils/validationSchemas";
import z from "zod";
import * as bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/utils/generateToken";
import { sendVerificationToken } from "@/utils/mail";

export const loginAction = async (data: z.infer<typeof loginSchema>) => {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "invalid credentials" };
  }
  const { email, password } = validation.data;

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

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
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

export const logoutAction = async () => {
  await signOut();
};
