import { Translate } from "@/lib/i18n";
import { fallbackLng, languages } from "@/lib/i18n/settings";
import Link from 'next/link'

type Params = Promise<{ lng: string }>

export default async function Page(props: {
  params: Params
}){
  const params = await props.params
  const lng = params.lng;
  const { t } = await Translate(lng)

  return (
    <div>
      <div>
        {t("title")}        
      </div>
      <Link href={`${lng}/story`}> {t("story")} </Link>
      
    </div>
  )
}