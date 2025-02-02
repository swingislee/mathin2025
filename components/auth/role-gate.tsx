"use client"

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "./form-error";
import { Database } from "@/utils/types/supabase";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: Database["public"]["Enums"]["user_role"];
}

export const RoleGate = ({
  children,
  allowedRole
}: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="you cant in" />
  }

  return (    
    <>
      {children}
    </>
  );
};