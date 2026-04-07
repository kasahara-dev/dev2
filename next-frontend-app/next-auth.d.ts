import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // Laravelから返ってくるその他のフィールド（name, email等）
    } & DefaultSession["user"];
  }
}
