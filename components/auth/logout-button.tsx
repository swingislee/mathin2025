"use client";

import { createClient } from "@/utils/supabase/client";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton =({children}:LogoutButtonProps) => {
  const onClick = () => {
    const supabase = createClient();
    supabase.auth.signOut();
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )

}