import { Translate } from "@/lib/i18n";
import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/utils/supabase/server"

type Params = Promise<{ lng: string }>

export default async function storyPage (props: {
  params: Params
}){
  const params = await props.params
  const lng = params.lng;
  const { t } = await Translate(lng)
  const session = await auth()
  const user = session?.user;

  const supabase = await createClient();

    const { data, error } = await supabase
      .schema('edu_core')
      .from('students')
      .select('*');

    const { data:classdata,error:classerror } = await supabase
      .from("学情统计")
      .select('*');


    return (
    <>
    <pre>{JSON.stringify(user,null,2)}</pre>
    <pre>{JSON.stringify(session,null,2)}</pre>
    <Link href={`/${lng}`}> {t("title")} </Link>
    <LogoutButton>logout</ LogoutButton>
    <pre>{JSON.stringify(data,null,2)}</pre>
    <pre>{JSON.stringify(error,null,2)}</pre>
    <pre>{JSON.stringify(classdata,null,2)}</pre>
    <pre>{JSON.stringify(classerror,null,2)}</pre>
    </>
    );
  }