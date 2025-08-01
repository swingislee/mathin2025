"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

export function useCurrentUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 创建浏览器端 Supabase 客户端
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ); // :contentReference[oaicite:0]{index=0}

    // 初次拉取当前用户（会向服务器校验 token）
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        console.error("获取用户失败：", error);
      } else {
        setUser(user);
      }
    }); // :contentReference[oaicite:1]{index=1}

    // 订阅后续的登录状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return user;
}
