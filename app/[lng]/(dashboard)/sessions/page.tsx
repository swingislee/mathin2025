"use client"

import { useEffect, useState } from "react";

import { DataTable } from "./_components/data-table";
import { sessionColumns } from "./_components/columns"

import { fetchSessions } from "@/actions/teacher/fetch-sessions";
import type {SessionRecord} from "@/actions/teacher/fetch-sessions"



export default function Page() {
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


