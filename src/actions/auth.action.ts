"use server";
import { loginSchema, registerSchema } from "@/utils/validationSchemas"
import z from "zod"

export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
        return { error: "email or password is invalid" };
    }
    
    // Simulate a login action
    console.log("Login successful with data:", data);
    
    // Reset form fields
    return { message: "Login successful" };
}

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
        return { error: "email or password is invalid" };
    }
    
    // Simulate a registration action
    console.log("Registration successful with data:", data);
    
    // Reset form fields
    return { message: "Registration successful" };
}