import { createClient } from "@/utils/supabase/server"; // Adjust the import path as needed

export const getTwoFactorTokenByToken = async (token: string) => {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from('auth_two_factor_token') // Use the actual table name
      .select('*')
      .eq('token', token)
      .single();

    return data;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from('auth_two_factor_token') // Use the actual table name
      .select('*')
      .eq('email', email)
      .single(); // Assumes only one token is relevant; remove .single() if multiple tokens are expected

    return data;
  } catch {
    return null;
  }
};


