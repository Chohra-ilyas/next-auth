import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./utils/prisma";
import GitHub from "next-auth/providers/github";
import * as bcrypt from "bcryptjs";
import { loginSchema } from "./utils/validationSchemas";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Credentials({
      async authorize(data) {
        const validation = await loginSchema.safeParse(data);
        if (validation.data) {
          const { email, password } = validation.data;
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(password, user.password);
          if (isValidPassword) {
            return user;
          }
        }
        return null;
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  ],
} satisfies NextAuthConfig;
