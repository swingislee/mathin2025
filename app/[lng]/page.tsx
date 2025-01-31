import { Translate } from "@/lib/i18n";
import Link from 'next/link'
import { createClient } from "@/utils/supabase/server";

type Params = Promise<{ lng: string }>

export default async function Page(props: {
  params: Params
}){
  const params = await props.params
  const lng = params.lng;
  const { t } = await Translate(lng)

  const supabase = await createClient();

  const { data, error: childrenError } = await supabase
    .schema('next_auth')
    .from('users')
    .select('*');


  if (childrenError) {
    console.error(childrenError);
    return; // Handle error appropriately
  }

  return (
    <div>
      <div>
        {t("title")}        
      </div>
      <Link href={`${lng}/story`}> {t("story")} </Link>
      
      <>{JSON.stringify(data, null, 2)}</>
    </div>
  )
}