import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import * as bcrypt from "bcryptjs";
import { prisma } from "./utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { loginSchema } from "./utils/validationSchemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
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
});
