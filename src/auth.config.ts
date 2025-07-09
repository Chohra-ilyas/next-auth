import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./utils/prisma";
import * as bcrypt from "bcryptjs";
import { loginSchema } from "./utils/validationSchemas";

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
  ],
} satisfies NextAuthConfig;
