import { createClient } from "@/utils/supabase/server";


export const currentUser = async () => {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('获取当前用户失败：', error)
    return null
  }
  return user
};
