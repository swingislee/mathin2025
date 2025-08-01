'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const logout = async () => {
  // 创建一个带 cookie 支持的 Supabase 客户端
  const supabase = await createClient();  // :contentReference[oaicite:0]{index=0}

  // 调用 signOut 方法，清除当前会话
  const { error } = await supabase.auth.signOut();         // :contentReference[oaicite:1]{index=1}
  if (error) {
    // 根据需要处理错误
    console.error('Logout error:', error);
    throw error;
  }
};
