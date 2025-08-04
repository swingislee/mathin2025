"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClassTableRow } from "../page"


export const columns: ColumnDef<ClassTableRow>[] = [
  {
    accessorKey: "class_name",
    header: "班级名称",
    cell: ({ row , getValue}) => (
    <Link
        href={`/classes/${row.original.id}`}
        className="font-medium hover:underline"
    >
        {getValue<string>()}
    </Link>
    ),
  },
  {
    accessorKey: "grades",
    header: "年级",
  },
  {
    accessorKey: "teacher_name",
    header: "教师",
  },
  {
    id: "capacity",
    header: () => <div className="text-right">报名人数</div>,
    accessorFn: (row: ClassTableRow) =>
      `${row.enrolled_students ?? 0}/${row.max_students ?? 0}`,
    cell: ({ getValue }) => (
      <div className="text-right">{getValue<string>()}</div>
    ),
  },
  {
    accessorKey: "is_published",
    header: "已发布",
    cell: ({ getValue }) => (getValue<boolean>() ? "是" : "否"),
  },
  {
    accessorKey: "season",
    header: "季节",
  },
  {
    accessorKey: "current_session",
    header: "当前节次",
    cell: ({ getValue }) => getValue<number>() ?? 0,
  },
  {
    accessorKey: "total_sessions",
    header: "总节次",
    cell: ({ getValue }) => getValue<number>() ?? 0,
  },
  {
    accessorKey: "subject",
    header: "科目",
  },
  {
    accessorKey: "start_time",
    header: "开始时间",
    cell: ({ getValue }) =>
      getValue<string>()
        ? new Date(getValue<string>()).toLocaleString("zh-CN")
        : "-",
  },
  {
    accessorKey: "end_time",
    header: "结束时间",
    cell: ({ getValue }) =>
      getValue<string>()
        ? new Date(getValue<string>()).toLocaleString("zh-CN")
        : "-",
  },
  {
    accessorKey: "campus",
    header: "校区",
  },
  {
    accessorKey: "course_fee",
    header: "课程费用",
    cell: ({ getValue }) => getValue<number>()?.toFixed(2) ?? "0.00",
  },
  {
    accessorKey: "planned_capacity",
    header: "规划容量",
    cell: ({ getValue }) => getValue<number>() ?? 0,
  },
  {
    accessorKey: "class_status",
    header: "班级状态",
  },
  {
    accessorKey: "assessment_difficulty",
    header: "评估难度",
  },
  {
    accessorFn: row => row.rooms?.name ?? '—',
    accessorKey: "room_name",
    header: "教室",
  },
  {
    accessorKey: "updated_at",
    header: "更新时间",
    cell: ({ getValue }) =>
      getValue<string>()
        ? new Date(getValue<string>()).toLocaleString("zh-CN")
        : "-",
  },

  {
    accessorKey: "created_at",
    header: "创建时间",
    cell: ({ getValue  }) =>
      new Date(getValue<string>()).toLocaleDateString("zh-CN"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/classes/${data.id}/edit`}>编辑</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => {
                // TODO: deleteClass(data.id)
              }}
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
