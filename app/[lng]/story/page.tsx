import { Translate } from "@/lib/i18n";
import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";

type Params = Promise<{ lng: string }>

export default async function storyPage (props: {
  params: Params
}){
  const params = await props.params
  const lng = params.lng;
  const { t } = await Translate(lng)
  const session = await auth()
  const user = session?.user;

    return (
    <>
    <pre>{JSON.stringify(user)}</pre>
    <pre>{JSON.stringify(session)}</pre>
    <Link href={`/${lng}`}> {t("title")} </Link>
    <LogoutButton>logout</ LogoutButton>
    </>
    );
  }