"use server";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/types/supabase";

export type StudentsRow = Database["edu_core"]["Tables"]["students"]["Row"];

export const fetchStudents = async (sessionId:string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema('edu_core')
      .from('sessions')
      .select(`
        id,
        classes!inner(
          class_students!inner(
            students(*)
          )
        )
      `)
      .eq('id', sessionId);
        
    if (error) {
      console.error(error);
      return [];
    }
  
  const allStudents = data
    ? data
        .flatMap(sess => sess.classes)                      // sessions → classes[]
        .flatMap(cls => cls.class_students)                // classes → class_students[]
        .map(cs => cs.students)                            // class_students → students
    : [];

  return allStudents;

};