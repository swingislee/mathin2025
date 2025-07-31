import { AvatarButton } from "@/components/auth/avatar-button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  return (
    <nav className=" pt-4 px-6 flex items-center justify-between select-none">
      <div className="flex items-center">
        <SidebarTrigger />
        <div className="flex-col hidden tl:flex ml-4">
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="text-muted-foreground ">Monitor all of your projects and tasks here</p>
        </div>
      </div>
      <AvatarButton />
    </nav>
  );
};

export default Navbar;