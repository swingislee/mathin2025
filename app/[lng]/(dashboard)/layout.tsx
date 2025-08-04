import Navbar from '@/app/[lng]/(dashboard)/_components/navbar';
import { AppSidebar } from '@/app/[lng]/(dashboard)/_components/sidebar';
import { languages, fallbackLng } from '@/lib/i18n/settings'
import { SidebarProvider} from "@/components/ui/sidebar"
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
    <SidebarProvider defaultOpen={defaultOpen}   
      style={{
        ["--sidebar-width" as string]: "14rem",
        ["--sidebar-width-mobile" as string]: "14rem",
    }}>
      <div className="flex bg-red-300">
        <AppSidebar  />
        <div className="bg-green-100">
          {/* Navbar */}
          <Navbar />

          {/* Main content */}
          <main className="bg-yellow-200">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

