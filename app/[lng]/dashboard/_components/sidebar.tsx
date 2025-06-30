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
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-center justify-center">
            <Image src='/assets/tohome.png' alt="to home" width={30} height={30} /> 
            <h1 className="text-4xl whitespace-nowrap">Math Note</h1>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Navigation />
      </SidebarContent>
    </Sidebar>
  )


}