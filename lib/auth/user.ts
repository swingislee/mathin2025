import { createClient } from "@/utils/supabase/server";

export const currentUser = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const currentRole = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.user_metadata?.role as string | undefined;
};

export const currentAccessToken = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};