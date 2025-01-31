import './globals.css'

import { dir } from 'i18next'
import { languages, fallbackLng } from '@/lib/i18n/settings'
import { Translate } from '@/lib/i18n'
import Footer from '@/components/Footer'
import { ThemeProvider } from "@/components/providers/theme-provider"

type Params = Promise<{ lng: string }>

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export async function generateMetadata(props: {
  params: Params
}) {
  let { lng } = await props.params;
  if (languages.indexOf(lng) < 0) lng = fallbackLng
  const { t } = await Translate(lng)

  return {
    title: t('title'),
    content: 'test website.'
  }
}

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Params;
  }
) {
  const { lng } = await props.params;
  const { children } = props;

  return (
    <html lang={lng} dir={dir(lng)}>
      <head />
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        <Footer />    
        </ThemeProvider>  
      </body>
    </html>
  )
}

