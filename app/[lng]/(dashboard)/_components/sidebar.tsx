import Image from "next/image"
import Link from "next/link"
import Navigation from "./navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"

export const AppSidebar =() => {


  return(
    <Sidebar className="bg-transparent">
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-start">
            <Image src='/assets/tohome.png' alt="to home" width={32} height={32} /> 
            <div className="text-3xl whitespace-nowrap">Math Note</div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Navigation />
      </SidebarContent>
    </Sidebar>
  )


}