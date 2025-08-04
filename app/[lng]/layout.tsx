import './globals.css'

import { dir } from 'i18next'
import { languages, fallbackLng } from '@/lib/i18n/settings'
import { Translate } from '@/lib/i18n'
import Footer from '@/components/Footer'
import { ThemeProvider } from "@/components/Providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"

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
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <div className='h-full'>
            {children}
          </div>
          <Toaster/>
          <Footer />    
        </ThemeProvider>  
      </body>
    </html>
  )
}

