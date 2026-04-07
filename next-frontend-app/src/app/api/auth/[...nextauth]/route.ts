import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, // http://localhost/api/login
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        const user = await res.json();

        if (res.ok && user) {
          // ログイン成功時にLaravelが返してくれたユーザー情報をそのままNextAuthに渡す
          return user;
        }

        return null;
      },
      // async authorize(credentials, req) {
      //   // Laravel APIへのログインリクエスト
      //   const res = await fetch(
      //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
      //     // "http://localhost/login",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Accept: "application/json",
      //       },
      //       body: JSON.stringify({
      //         email: credentials?.email,
      //         password: credentials?.password,
      //       }),
      //       cache: "no-store",
      //     },
      //   );

      //   if (!res.ok) {
      //     return null;
      //   }

      //   // ユーザー情報を取得
      //   const userRes = await fetch(
      //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
      //     {
      //       headers: {
      //         // ログインリクエストのレスポンスからCookieヘッダーを取得して設定
      //         Cookie: res.headers.get("set-cookie") || "",
      //       },
      //     },
      //   );

      //   if (!userRes.ok) {
      //     return null;
      //   }

      //   const user = await userRes.json();

      //   // ユーザーオブジェクトを返す
      //   return user;
      // },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // ログイン時に返されたユーザー情報をトークンに含める
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // JWTトークンの情報をセッションに含める
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/login", // カスタムログインページのパス
  },
});

export { handler as GET, handler as POST };
