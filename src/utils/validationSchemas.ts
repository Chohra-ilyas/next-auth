import z from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(100)
    .trim(),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100)
    .trim(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100)
    .trim(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
});
