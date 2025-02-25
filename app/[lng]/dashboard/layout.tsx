import Navbar from '@/components/block/navbar';
import { AppSidebar } from '@/components/block/sidebar';
import { languages, fallbackLng } from '@/lib/i18n/settings'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from 'next/headers';

type Params = Promise<{ lng: string }>


export async function generateMetadata(props: {
  params: Params
}) {
  let { lng } = await props.params;
  if (languages.indexOf(lng) < 0) lng = fallbackLng

  return {
    title: "Dashboard",
    content: 'test website.'
  }
}



export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Params;
  }
) {
  const { children } = props;
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"


  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
        <main className='w-full'>
        <Navbar />
          {children}
        </main>
    </SidebarProvider>
  )
}

