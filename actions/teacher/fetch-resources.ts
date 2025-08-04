"use server";

import { createClient } from "@/utils/supabase/server"

export async function fetchLectureResources(sessionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('edu_core')
    .from('sessions')
    .select(`
        id,
        start_time,
        end_time,
        notes,

        lectures (
        lecture_number,
        title,

        lecture_resources (
            slot,
            display_order,
            config,

            resources (
            id,
            name,
            type,
            storage_path,
            metadata
            )
        )
        )
    `)
    .eq('id', sessionId)


  if (error) {
    console.error('拉取资源失败', error)
    throw error
  }
  return data
}