"use server";

import * as z from "zod";
import { createClient } from "@/utils/supabase/server";
import { RegisterSchema } from "@/schemas/auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // 1. 校验输入
  const parsed = RegisterSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Invalid input fields." };
  }
  const { email, password, name } = parsed.data;

  // 2. 初始化 Supabase 客户端
  const supabase = await createClient();

  // 3. 正确调用 signUp：单个对象入参，额外 metadata 放在 options.data
  const { data: signUpData, error: signUpError } =
    await supabase.auth.signUp({
      email,
      password,
    });                    

  if (signUpError) {
    return { error: signUpError.message };
  }

  // 4. TS 要求做空值保护
  if (!signUpData?.user) {
    return { error: "Failed to create user account." };
  }

  return {
    success: "Registration successful! Check your email to confirm your account.",
  };
};
