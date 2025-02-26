import { z } from "zod";

// 基本学情统计 Schema
export const 学情统计Schema = z.object({
  学生id: z.string().uuid({
    message: "必须是有效的 UUID 格式",
  }),
  课程id: z.string().uuid().nullable().optional(),
  讲次: z.number()
    .int()
    .min(1, "不能小于1")
    .optional(),
  课程环节: z.string().nullable().optional(),
  学情记录: z.string().nullable().optional(),
  星: z.number().int().nullable().optional(),
  雷: z.number().int().nullable().optional(),
});

