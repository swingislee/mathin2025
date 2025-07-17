import { ColumnDef } from '@tanstack/react-table'
import { parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

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
import Link from 'next/link'
// 复用你定义的类型
export type SessionRecord = {
  id: string
  class_id: string
  course_id: string
  lecture_id: string | null
  start_time: string
  end_time: string | null
  room_id: string | null
  teacher_id: string | null
  notes: string | null
  created_at: string | null
  updated_at: string | null

  classes:  { class_name: string }     | null
  courses:  { name:       string }     | null
  lectures: { title:      string | null } | null
  teachers: { name:       string }     | null
  rooms:    { room_number: string | null } | null
}

const TZ = 'Asia/Shanghai'
const fmt = (iso: string) =>
  formatInTimeZone(parseISO(iso), TZ, 'yyyy-MM-dd HH:mm:ss')

export const sessionColumns: ColumnDef<SessionRecord>[] = [
  {
    accessorFn: row => row.classes?.class_name ?? '—',
    id: 'class_name',
    header: '班级',
  },
  {
    accessorFn: row => row.courses?.name ?? '—',
    id: 'course_name',
    header: '课程',
  },
  {
    accessorFn: row => row.lectures?.title ?? '—',
    id: 'lecture_title',
    header: '讲次',
  },
  {
    accessorFn: row => row.teachers?.name ?? '—',
    id: 'teacher_name',
    header: '教师',
  },
  {
    accessorFn: row => row.rooms?.room_number ?? '—',
    id: 'room_number',
    header: '教室',
  },
  {
    accessorKey: 'start_time',
    header: '开始时间',
    cell: info => fmt(info.getValue<string>()),
  },
  {
    accessorKey: 'end_time',
    header: '结束时间',
    cell: info =>
      info.getValue<string>()
        ? fmt(info.getValue<string>()!)
        : '—',
  },
  {
    accessorKey: 'notes',
    header: '备注',
    cell: info => info.getValue<string>() ?? '—',
  },
{
    id: "actions",
    header: "操作",
    cell: ({ row }) => {
      const session = row.original

      return (
        <div className="flex space-x-2">
          {/* 去备课页面 */}
          <Link href={`/sessions/${session.id}`}>
            <Button size="sm" variant="outline">备课</Button>
          </Link>
          {/* 去上课页面 */}
          <Link href={`/sessions/${session.id}/demo`}>
            <Button size="sm" variant="outline">
              上课
            </Button>
          </Link>
        </div>
      )
    },
  },
]