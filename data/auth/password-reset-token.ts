import { createClient } from "@/utils/supabase/server"; // Ensure this path matches your Supabase client import path

export const getPasswordResetTokenByToken = async (token: string) => {
  const supabase = await createClient();
  try {
    const { data } = await supabase
      .schema("next_auth")
      .from('password_reset_token') // Adjust if your table name is different
      .select('*')
      .eq('token', token)
      .single();

    return data;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  const supabase = await createClient();
  try {
    const { data } = await supabase
      .schema("next_auth")
      .from('password_reset_token') // Adjust if your table name is different
      .select('*')
      .eq('email', email)
      .single();
    return data;
  } catch {
    return null;
  }
};

