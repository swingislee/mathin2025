"use server";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/types/supabase";

type SessionRow = Database['edu_core']['Tables']['sessions']['Row']

type ClassRow   = Database['edu_core']['Tables']['classes']['Row']
type CourseRow  = Database['edu_core']['Tables']['courses']['Row']
type LectureRow = Database['edu_core']['Tables']['lectures']['Row']
type TeacherRow = Database['edu_core']['Tables']['teachers']['Row']
type RoomRow    = Database['edu_core']['Tables']['rooms']['Row']

export type SessionRecord = SessionRow & {
  classes:  Pick<ClassRow,   'class_name'>  | null
  courses:  Pick<CourseRow,  'name'>        | null
  lectures: Pick<LectureRow, 'title'>       | null
  teachers: Pick<TeacherRow, 'name'>        | null
  rooms:    Pick<RoomRow,    'name'> | null
}

export const fetchSessions = async () => {
    const supabase = await createClient();

    const { data , error } = await supabase
    .schema('edu_core')
    .from('sessions')
    .select(`
      *,
      classes (class_name),
      courses (name),
      lectures(title),
      teachers(name),
      rooms   (name)
    `)
    .order('start_time', { ascending: true })

    if (error) {
        console.log("fetch sessions",error)
        throw error;
    }

  return data 
};