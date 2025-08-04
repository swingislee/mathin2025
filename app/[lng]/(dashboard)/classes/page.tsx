import { createClient } from "@/utils/supabase/server"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { Database } from "@/utils/types/supabase"

type ClassRow   = Database['edu_core']['Tables']['classes']['Row']
type CourseRow  = Database['edu_core']['Tables']['courses']['Row']
type TeacherRow = Database['edu_core']['Tables']['teachers']['Row']
type RoomRow    = Database['edu_core']['Tables']['rooms']['Row']

export type ClassTableRow = ClassRow & {
  courses:  Pick<CourseRow,  'name'>        | null
  teachers: Pick<TeacherRow, 'name'>        | null
  rooms:    Pick<RoomRow,    'name'> | null
}

// 拉取班级 + 教师姓名 + 报名人数
async function getClasses() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .schema('edu_core')
    .from("classes")
    .select(
      `
      *,
      courses (name),
      teachers ( name ),
      rooms   (name)
    `,
    )
    .order("created_at", { ascending: false })

  if (error) throw error

  return (
    data?.map((row) => ({
      ...row,
      teacher_name: row.teachers?.name ?? "-",
    })) ?? []
  )
}

export const metadata = { title: "班级列表" }

export default async function ClassesPage() {
  const data = await getClasses()
  return (
    <div className="container mx-auto py-8">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
