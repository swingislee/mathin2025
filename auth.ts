"use server";
import { createClient } from "@/utils/supabase/server";
import { Session } from "@supabase/supabase-js";

export const auth = async (): Promise<Session | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};
