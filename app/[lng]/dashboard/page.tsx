import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { DottedSeparator } from "@/components/dotted-separator";

type Params = Promise<{ lng: string }>

export default async function Page(props: {
  params: Params
}){
  const params = await props.params
  const lng = params.lng;

  const supabase = await createClient();

  const { data, error: childrenError } = await supabase
    .from('学生档案')
    .select('*');


  if (childrenError) {
    console.error(childrenError);
    return; // Handle error appropriately
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      
    </div>
  )
}