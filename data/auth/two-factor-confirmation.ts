import { createClient } from "@/utils/supabase/server"; // Ensure correct import path

export const getTwoFactorConfirmationByUserId = async (userId:string ) => {
  const supabase = await createClient();
  try {
    const { data } = await supabase
      .schema("next_auth")
      .from('2fa_confirmation') // Adjust to your actual table name
      .select('*')
      .eq('userId', userId)
      .single(); // Assuming there's a unique two-factor confirmation per userId

    return data;
  } catch {
    return null;
  }
};
