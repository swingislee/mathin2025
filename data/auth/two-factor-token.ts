import { createClient } from "@/utils/supabase/server"; // Adjust the import path as needed

export const getTwoFactorTokenByToken = async (token: string) => {
  const supabase = await createClient();
  try {
    const { data } = await supabase
      .schema("next_auth")
      .from('two_factor_token') // Use the actual table name
      .select('*')
      .eq('token', token)
      .single();

    return data;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .schema('next_auth')
      .from('two_factor_token') // Use the actual table name
      .select('*')
      .eq('email', email)
      .single(); // Assumes only one token is relevant; remove .single() if multiple tokens are expected

    return data;
  } catch {
    return null;
  }
};


