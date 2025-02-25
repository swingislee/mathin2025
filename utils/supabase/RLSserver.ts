import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../types/supabase";
import { Session } from 'next-auth';

export async function createClient(session:Session | null) {
  const cookieStore = await cookies();

  const supabaseAccessToken = session?.supabaseAccessToken || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    }
  );
}
