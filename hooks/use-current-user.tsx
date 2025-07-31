import { useSupabaseSession } from "./use-supabase-session"

export const useCurrentUser = () => {
  const session = useSupabaseSession();

  return session?.user || undefined
};