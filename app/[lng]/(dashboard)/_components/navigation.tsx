import { cn } from "@/lib/utils";
import { BookOpen, CalendarDays, LayoutDashboard, SettingsIcon, Users } from "lucide-react"
import Link from "next/link";
import { GoCheckCircle, GoCheckCircleFill, GoOrganization} from "react-icons/go"

const routes = [
  {
    label: "Overview",          
    href: "/overview",
    icon: LayoutDashboard,
    activeIcon: LayoutDashboard,
  },
  {
    label: "Students",          
    href: "/students",
    icon: Users,
    activeIcon: Users,
  },
  {
    label: "Classes",          
    href: "/classes",
    icon: BookOpen,
    activeIcon: BookOpen,
  },
  { 
    label: "Schedule", 
    href: "/sessions",
    icon: CalendarDays,
    activeIcon: CalendarDays,
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