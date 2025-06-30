import { cn } from "@/lib/utils";
import { SettingsIcon, UsersIcon } from "lucide-react"
import Link from "next/link";
import {GoBook, GoCalendar, GoCheckCircle, GoCheckCircleFill, GoDeviceCameraVideo, GoHome, GoHomeFill, GoOrganization, GoPeople} from "react-icons/go"

const routes = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill
  },
  {
    label: "My Tasks",
    href: "/dashboard/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon
  },
  {
    label: "Team Space",
    href: "/dashboard/team",
    icon: GoOrganization,      // 团队协作意象
    activeIcon: GoOrganization
  },
  {
    label: "Schedule",
    href: "/dashboard/schedule",
    icon: GoCalendar,          // 排课日历图标
    activeIcon: GoCalendar
  },
  {
    label: "My Classes",
    href: "/dashboard/classes",
    icon: GoBook,              // 代表课程/班级
    activeIcon: GoBook
  },
  {
    label: "My Students",
    href: "/dashboard/students",
    icon: GoPeople,            // 群体学生意象
    activeIcon: GoPeople
  },
  {
    label: "Teach",
    href: "/dashboard/teach",
    icon: GoDeviceCameraVideo,  // 在线授课意象
    activeIcon: GoDeviceCameraVideo
  }
];

const Navigation = () => {
  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const isActive = false
        const Icon = isActive? item.activeIcon : item.icon
        return(
          <Link key={item.href} href={item.href}>
            <div className={cn(
            "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-slate-500",
            isActive &&  "bg-white shadow-sm hover:opacity-100"
            )}>
              <Icon className="size-5 text-slate-500" />
              {item.label}
            </div>
          </Link>
        )
      })}
    </ul>
  );
};

export default Navigation;