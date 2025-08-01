"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      // 你也可以在这里显示一个用户友好的提示
    } else {
      // 登出后跳转到登录页或首页
      router.push("/login");
    }
  };

  return (
    <span onClick={handleLogout} className="cursor-pointer">
      {children}
    </span>
  );
};
