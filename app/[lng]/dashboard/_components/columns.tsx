// app/users/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "@/utils/types/supabase"
import { Badge } from "@/components/ui/badge"; // shadcn 组件
import Image from "next/image";

// 角色颜色映射
const roleColors = {
  ADMIN: "bg-red-500",
  USER: "bg-blue-500",
  TEACHER: "bg-green-500",
  STUDENT: "bg-yellow-500",
};

// 定义表格列
export const columns: ColumnDef<Database['next_auth']['Tables']['users']['Row']>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: ({ row }) =>
      row.original.emailVerified ? "✅ Verified" : "❌ Not Verified",
  },
  {
    accessorKey: "is2FAEnabled",
    header: "2FA",
    cell: ({ row }) =>
      row.original.is2FAEnabled ? "🔐 Enabled" : "❌ Disabled",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge className={`${roleColors[row.original.role]} text-white px-2 py-1`}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "image",
    header: "Avatar",
    cell: ({ row }) =>
      row.original.image ? (
        <Image  src={row.original.image} alt="Avatar" className="h-10 w-10 rounded-full" />
      ) : (
        "No Image"
      ),
  },
];
