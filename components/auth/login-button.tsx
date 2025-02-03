"use client"

import { useRouter } from 'next/navigation'
import { useParams } from "next/navigation"
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DialogContent } from '@radix-ui/react-dialog';
import { LoginForm } from '@/components/auth/login-form';

interface LoginButtonProps{
    children:React.ReactNode;
    mode?:"modal"|"redirect",
    asChild?:boolean;
};

export const LoginButton = ({
    children,
    mode = "redirect",
    asChild
}:LoginButtonProps) =>{
    const params = useParams<{ lng: string; }>()
    const router = useRouter()

    if (mode === "modal"){
        return(
            <Dialog>
              <DialogTrigger asChild={asChild}>
                {children}
              </DialogTrigger>
              <DialogContent>
                <LoginForm />
              </DialogContent>
            </Dialog>
        )    
    }

    return(
        <span onClick={()=> router.push(`/${params.lng}/login`)} className="cursor-pointer">
            {children}
        </span>
    );
};