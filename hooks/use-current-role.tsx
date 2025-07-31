import { useSupabaseSession } from "./use-supabase-session"

export const useCurrentRole = () => {
  const session = useSupabaseSession();

  return session?.user?.user_metadata?.role as string | undefined
};