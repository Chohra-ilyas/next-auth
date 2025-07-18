import NextAuth from "next-auth";
import { prisma } from "./utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (user) {
          session.user.role = user.role;
          session.user.isTwoStepEnabled = user.isTwoStepEnabled;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!existingUser?.emailVerified) {
        return false;
      }
      if (existingUser?.isTwoStepEnabled) {
        const twoStepToken = await prisma.twoStepConfirmation.findFirst({
          where: { userId: user.id },
        });
        if (!twoStepToken) {
          return false;
        }
        await prisma.twoStepConfirmation.delete({
          where: { id: twoStepToken.id },
        });
      }
      return true;
    },
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
