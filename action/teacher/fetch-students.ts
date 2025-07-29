"use server";
import { auth } from "@/auth";
import { createClient } from "@/utils/supabase/RLSserver";
import { Database } from "@/utils/types/supabase";

export type StudentsRow = Database["edu_core"]["Tables"]["students"]["Row"];

type SessionWithStudents = {
  id: string;
  classes: {
    class_students: {
      students: StudentsRow[];
    }[];
  }[];
};


export const fetchStudents = async (sessionId:string) => {
    const session = await auth();
    const supabase = await createClient(session);

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