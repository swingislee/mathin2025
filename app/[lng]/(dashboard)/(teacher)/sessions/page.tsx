"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { DataTable } from "./_components/data-table";
import { sessionColumns } from "./_components/columns"

import { fetchSessions } from "@/action/teacher/lessons";
import type {SessionRecord} from "@/action/teacher/lessons"



export default function Page() {
  const session =useSession();
  const [lessones, setLessones] = useState<SessionRecord[]>([]);
 

  useEffect(() => {
    fetchSessions()
      .then(
        (data)=>{setLessones(data)}
      )
  }, []); // 空依赖数组，确保只在组件挂载时运行一次


  return (
    <div className="container">
      <DataTable columns={sessionColumns} data={lessones} />
    </div>
  );
}


