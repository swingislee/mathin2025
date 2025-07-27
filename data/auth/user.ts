import { createClient } from "@/utils/supabase/server";

export const getUserByEmail = async (email: string) => {
  try {
    // Use the Supabase client to query your database
    const supabase = await createClient();
    const { data } = await supabase
        .schema("next_auth")
        .from('users') 
        .select('*') 
        .eq('email', email) // Filter to match the email
        .single(); // Ensures that only one record is returned, or null

    return data;

  } catch (error) {
      return null;
  }
};

export const getUserById = async (id: string) => {
    try {
      // Use the Supabase client to query your database
      const supabase = await createClient();
      const { data } = await supabase
          .schema("next_auth")
          .from('users') 
          .select('*') 
          .eq('id', id) // Filter to match the user ID
          .single(); // Ensures that only one record is returned, or null
      return data;
    } catch (error) {
        return null;
    }
  };