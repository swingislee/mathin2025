"use server";

import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/utils/types/supabase";

type SessionRow = Database["edu_core"]["Tables"]["sessions"]["Row"];
type LectureRow = Database["edu_core"]["Tables"]["lectures"]["Row"];
type LRRow      = Database["edu_core"]["Tables"]["lecture_resources"]["Row"];
type RTRow      = Database["edu_core"]["Tables"]["resources"]["Row"];

export type SessionWithResources = Omit<SessionRow, "lectures"> & {
  lectures:
    | (LectureRow & {
        lecture_resources: (LRRow & {
          resources: RTRow & { signedURL?: string; componentURL?: string };
        })[];
      })
    | null;
};

export async function fetchLectureResources(
  sessionId: string
) {
  // 1. 身份验证 & 创建有权限访问私有 bucket 的客户端
  const supabase = await createClient();

  // 2. 拉取基础数据：session → lectures → lecture_resources → resources
  const { data: session, error: sesErr } = await supabase
    .schema("edu_core")
    .from("sessions")
    .select(
      `
      *,
      lectures (
        *, 
        lecture_resources (
          *, 
          resources (*)
        )
      )
    `
    )
    .eq("id", sessionId)
    .single();

  if (sesErr) throw sesErr;
  if (!session) return ;

   // 3. If there are no lectures attached, short-circuit
  if (!session.lectures) {
    return { ...session, lectures: null };
  }

    // 4. Enrich each lecture_resource with signedURL or componentURL
  const enrichedLRs = await Promise.all(
    session.lectures.lecture_resources.map(async (lr) => {
      const resource = lr.resources;

      // a) If it's stored in Supabase Storage, generate a signed URL
      if (resource.storage_path) {
        const path = resource.storage_path.replace(
          "2025-lecture-resource/",
          ""
        );
        const { data: urlData, error: urlErr } = await supabase.storage
          .from("2025-lecture-resource")
          .createSignedUrl(path, 3600); // valid for 1 hour
        if (urlErr) console.error("Failed to create signed URL:", urlErr);

        return {
          ...lr,
          config: lr.config ?? {},
          resources: {
            ...resource,
            signedURL: urlData?.signedUrl,
          },
        };
      }

      // b) If it's a React component path, just expose the componentURL
      if (resource.component_path) {
        return {
          ...lr,
          config: lr.config ?? {},
          resources: {
            ...resource,
            componentURL: resource.component_path,
          },
        };
      }

      // c) Otherwise, leave unchanged
      return lr;
    })
  );

    // 5. Reassemble and return the enriched session object
  const lecturesWithUrls = {
    ...session.lectures,
    lecture_resources: enrichedLRs,
  };

  return {
    ...session,
    lectures: lecturesWithUrls,
  };

}
