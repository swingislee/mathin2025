import { Translate } from "@/lib/i18n";
import Link from "next/link";

type Params = Promise<{ lng: string }>

export default async function storyPage (props: {
  params: Params
}){
  const params = await props.params
  const lng = params.lng;
  const { t } = await Translate(lng)

    return (
    <>
    <h1>{JSON.stringify(lng)}</h1>
    <Link href={`/${lng}`}> {t("title")} </Link>
    </>
    );
  }