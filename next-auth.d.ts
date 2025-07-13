import { Role } from "@prisma/client";
import NextAuth,{type DefaultSession} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: Role,
      isTwoStepEnabled: boolean;
    };
  }
}