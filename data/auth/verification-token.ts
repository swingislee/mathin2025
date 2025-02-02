import { createClient } from "@/utils/supabase/server";

// Function to get a verification token by the token value
export const getVerificationTokenByToken = async (token: string) => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .schema("next_auth")
      .from('verification_tokens') // Use the actual table name
      .select('*')
      .eq('token', token) // Filter by the token column
      .single(); // Assuming token values are unique

    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

// Function to get a verification token by email
export const getVerificationTokenByEmail = async (email:string) => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .schema("next_auth")
      .from('verification_tokens') // Use the actual table name
      .select('*')
      .eq('email', email) // Filter by the email column
      .single(); // Assuming email addresses might have at most one associated verification token

    if (error) throw error;

    return data;
  } catch {
    return null;
  }
};
