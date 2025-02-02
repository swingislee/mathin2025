import { createClient } from "./server"

import { Database } from "../types/supabase"

import {
  type Adapter,
  type AdapterSession,
  type AdapterUser,
  type VerificationToken,
  isDate,
} from "@auth/core/adapters"

export function format<T>(obj: Record<string, any>): T {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      delete obj[key]
    }

    if (isDate(value)) {
      obj[key] = new Date(value)
    }
  }

  return obj as T
}

export function SupabaseAdapter(): Adapter {
  return {
    async createUser(user) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("users")
        .insert({
          ...user,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .select()
        .single()

      if (error) throw error;
      return format<AdapterUser>(data)
    },
    async getUser(id) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("users")
        .select()
        .eq("id", id)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      return format<AdapterUser>(data)
    },
    async getUserByEmail(email) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("users")
        .select()
        .eq("email", email)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      return format<AdapterUser>(data)
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("accounts")
        .select("users (*)")
        .match({ provider, providerAccountId })
        .maybeSingle()

      if (error) throw error
      if (!data || !data.users) return null

      return format<AdapterUser>(data.users)
    },
    async updateUser(user) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("users")
        .update({
          ...user,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

      if (error) throw error

      return format<AdapterUser>(data)
    },
    async deleteUser(userId) {
      const supabase = await createClient();
      const { error } = await supabase
        .schema('next_auth').from("users").delete().eq("id", userId)

      if (error) throw error
    },
    async linkAccount(account) {
      const supabase = await createClient();
      const { error } = await supabase
        .schema('next_auth').from("accounts").insert(account)

      if (error) throw error
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const supabase = await createClient();
      const { error } = await supabase
        .schema('next_auth')
        .from("accounts")
        .delete()
        .match({ provider, providerAccountId })

      if (error) throw error
    },
    async createSession({ sessionToken, userId, expires }) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("sessions")
        .insert({ sessionToken, userId, expires: expires.toISOString() })
        .select()
        .single()

      if (error) throw error

      return format<AdapterSession>(data)
    },
    async getSessionAndUser(sessionToken) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("sessions")
        .select("*, users(*)")
        .eq("sessionToken", sessionToken)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      const { users: user, ...session } = data

      return {
        user: format<AdapterUser>(
          user as Database["next_auth"]["Tables"]["users"]["Row"]
        ),
        session: format<AdapterSession>(session),
      }
    },
    async updateSession(session) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("sessions")
        .update({
          ...session,
          expires: session.expires?.toISOString(),
        })
        .eq("sessionToken", session.sessionToken)
        .select()
        .single()

      if (error) throw error

      return format<AdapterSession>(data)
    },
    async deleteSession(sessionToken) {
      const supabase = await createClient();
      const { error } = await supabase
        .schema('next_auth')
        .from("sessions")
        .delete()
        .eq("sessionToken", sessionToken)

      if (error) throw error
    },
    async createVerificationToken(token) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("verification_tokens")
        .insert({
          ...token,
          expires: token.expires.toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...verificationToken } = data

      return format<VerificationToken>(verificationToken)
    },
    async useVerificationToken({ identifier, token }) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .schema('next_auth')
        .from("verification_tokens")
        .delete()
        .match({ identifier, token })
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...verificationToken } = data

      return format<VerificationToken>(verificationToken)
    },
  }
}