'use client'

import { Button } from "@/components/ui/button";
import { Translate } from "@/lib/i18n/client";
import { languages } from "@/lib/i18n/settings";
import Link from "next/link";
import { usePathname } from "next/navigation";


export const Setlng = ({ lng }: { lng: string }) => {

  const { t } = Translate(lng);
  const currentPathname = usePathname();  

  function recordPathname(pathname:string) {
    const matchedLanguage = languages.find(lng => pathname.startsWith(`/${lng}`));
    if (matchedLanguage) {
      return pathname.replace(new RegExp(`^/${matchedLanguage}/?`), '/');
    }
    return pathname;
  }

  return (
    <div>
      {t("languageSwitcher")}
      {languages.filter((l) => lng !== l).map((l, index) => {
        return (
          <span key={l}>
            {index > 0 && (' or ')}
            <Button variant="secondary" size="icon" asChild>
              <Link href={`/${l}${recordPathname(currentPathname)}`}>
              {l}
              </Link>
            </Button>
          </span>
        )
      })}
    </div>
  );
};