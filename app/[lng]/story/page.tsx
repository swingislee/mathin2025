import { Translate } from "@/lib/i18n";
import Link from "next/link";

export default async function storyPage ({ params: { lng } }: {
  params: {
    lng: string;
  };
  }){
    const { t } = await Translate(lng)

    return (
    <>
    <h1>{JSON.stringify(lng)}</h1>
    <Link href={`/${lng}`}> {t("title")} </Link>
    </>
    );
  }