import { createClient } from "@/utils/supabase/server"; // Ensure correct import path

export const getAccountByUserId = async (userId:string) => {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .schema("next_auth")
      .from('accounts') // Adjust to your actual table name
      .select('*')
      .eq('userId', userId)
      .single(); // Assuming a single account is associated with a userId

    return data;
  } catch {
    return null;
  }
};
