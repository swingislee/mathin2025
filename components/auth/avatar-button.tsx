"use client"

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"

import { useCurrentUser } from "@/hooks/use-current-user";

import Image from "next/image";

export const AvatarButton = () => {
  const user = useCurrentUser();

  return (
    <Avatar className="h-6 w-6">          
    <AvatarImage src={user?.image || ""} />
      <AvatarFallback>
        <Image src={"/assets/avatars/initial/boy.png"} width={100} height={100} alt="avatar" />
      </AvatarFallback> 
    </Avatar>
  );
};