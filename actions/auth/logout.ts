'use server';

import { createClient } from '@/utils/supabase/server';

export const logout = async () => {
  // 创建一个带 cookie 支持的 Supabase 客户端
  const supabase = await createClient();  // :contentReference[oaicite:0]{index=0}

  // 调用 signOut 方法，清除当前会话
  const { error } = await supabase.auth.signOut();         // :contentReference[oaicite:1]{index=1}
  if (error) {
    throw error;
  }
};
