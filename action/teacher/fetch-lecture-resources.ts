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
): Promise<SessionWithResources[]> {
  // 1. 身份验证 & 创建有权限访问私有 bucket 的客户端
  const supabase = await createClient();

  // 2. 拉取基础数据：session → lectures → lecture_resources → resources
  const { data: sessions, error: sesErr } = await supabase
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
    .eq("id", sessionId);

  if (sesErr) throw sesErr;
  if (!sessions) return [];

  // 3. 为每个资源生成签名 URL 或直接使用 URL
  return Promise.all(
    sessions.map(async (s) => {
      if (!s.lectures) {
        return { ...s, lectures: null };
      }

      // 遍历 lecture_resources，异步处理资源
      const enrichedLRs = await Promise.all(
        s.lectures.lecture_resources.map(async (lr) => {
          const resource = lr.resources;

          if (resource.storage_path) {
            const pathWithoutBucket = resource.storage_path.replace("2025-lecture-resource/", "");
            const { data: urlData, error: urlErr } = await supabase.storage
              .from("2025-lecture-resource")  // 你的存储桶名称
              .createSignedUrl(pathWithoutBucket, 3600); // 1 小时后过期

            if (urlErr) {
              console.error("签名 URL 生成失败", urlErr);
            }

            return {
              ...lr,
              config: lr.config ?? {},
              resources: {
                ...resource,
                signedURL: urlData?.signedUrl, // 返回签名 URL
              },
            };
          } else if (resource.component_path) {
            // 对于 React 组件，直接返回 component_path
            return {
              ...lr,
              config: lr.config ?? {},
              resources: {
                ...resource,
                componentURL: resource.component_path, // 直接使用组件 URL
              },
            };
          }

          return lr; // 如果都没有，则不做任何处理
        })
      );

      const lec = {
        ...s.lectures,
        lecture_resources: enrichedLRs,
      };

      return { ...s, lectures: lec };
    })
  );
}
