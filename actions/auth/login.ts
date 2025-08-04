// app/actions/auth/login.ts
"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { LoginSchema } from "@/schemas/auth";
import { createClient } from "@/utils/supabase/server";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  lng: string,
  callbackUrl?: string | null,
) => {
  const parsed = LoginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Invalid email or password format." };
  }
  const { email, password } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please verify your email before logging in." };
    }
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password." };
    }
    return { error: error.message };
  }

  // —— 关键：登录成功后直接抛出重定向 —— 
  const to = callbackUrl || `/${lng}${DEFAULT_LOGIN_REDIRECT}`;
  redirect(to);
};
