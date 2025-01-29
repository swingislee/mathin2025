import { Translate } from "@/lib/i18n";
import { fallbackLng, languages } from "@/lib/i18n/settings";
import Link from 'next/link'


export default async function Page({ params: { lng } }: {
  params: {
    lng: string;
  };
}) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng
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