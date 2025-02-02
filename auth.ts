import NextAuth, { DefaultSession } from "next-auth"
import { getUserById } from "@/data/auth/user" 
import authConfig from "@/auth.config";
import { SupabaseAdapter } from "@/utils/supabase/adapter";
import { createClient } from "@/utils/supabase/server";
import { getTwoFactorConfirmationByUserId } from "@/data/auth/two-factor-confirmation";
import { getAccountByUserId } from "./data/auth/account";
import { JWT } from "next-auth/jwt"
import { UserRow } from "./utils/types/customTypes";
import jwt from "jsonwebtoken"



declare module "next-auth" {
  interface User {
    role?: UserRow["role"],
    is2FAEnabled?: UserRow["is2FAEnabled"],
    isOAuth?: boolean;
  }

  interface Session {
    supabaseAccessToken?: string
    user: {
      role?: UserRow["role"],
      is2FAEnabled: UserRow["is2FAEnabled"],
      isOAuth: boolean;
      supabaseAccessToken: string,
    } & DefaultSession["user"]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRow["role"],
    is2FAEnabled: UserRow["is2FAEnabled"]
    isOAuth: boolean,
  }
}

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      const supabase = await createClient()
      const {error} = await supabase
        .schema("next_auth")
        .from('users')
        .update({emailVerified: new Date().toISOString()})
        .match({ id: user.id }); 
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true
      };

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) return false;

      if (existingUser.is2FAEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        const supabase = await createClient();
        await supabase
          .schema("next_auth")
          .from("2fa_confirmation")
          .delete()
          .match({id: twoFactorConfirmation.id})
      }

      return true;
    },


    async session({ token, session }) {

      if (session.user) {
        session.user.is2FAEnabled = token.is2FAEnabled;
        session.user.name = token.name;  
        session.user.isOAuth = token.isOAuth;

        if (token.sub) session.user.id = token.sub;
        if (token.role)  session.user.role = token.role;
        if (token.email) session.user.email = token.email;
      }

      const signingSecret = process.env.SUPABASE_JWT_SECRET
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.sub,
          email: token.email,
          role: "authenticated",
        }
        session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(
        existingUser.id
      );

      if (!existingUser) return token;

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.is2FAEnabled = existingUser.is2FAEnabled;

      return token;
    },
  },
  adapter: SupabaseAdapter(),
  session: { strategy: "jwt" },
  ...authConfig,
});
