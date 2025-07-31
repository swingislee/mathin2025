"use client"
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { FaWeixin } from "react-icons/fa";
import { BsTencentQq } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client'

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Suspense } from "react";

function SearchBarFallback() {
    return (
        <div className="flex w-full items-center justify-center gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                disabled
            >
                <FaWeixin className="h-5 w-5"/>                
            </Button>
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                disabled
            >
                <BsTencentQq className="h-5 w-5"/>                
            </Button>

            <Button
                size="lg"
                className="w-full"
                variant="outline"
                disabled
            >
                <FaGithub className="h-5 w-5"/>                
            </Button>
            
        </div>
    )
  }

export const Social = () => {
    const params = useParams<{ lng: string; }>()
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    
    const onClick = async (provider: "wechat" | "qq" | "github") => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: callbackUrl || `/${params.lng}${DEFAULT_LOGIN_REDIRECT}`
            }
        })
    }
    return(
        <Suspense fallback={<SearchBarFallback />}>

        <div className="flex w-full items-center justify-center gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick("wechat")}
            >
                <FaWeixin className="h-5 w-5"/>                
            </Button>
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick("qq")}
            >
                <BsTencentQq className="h-5 w-5"/>                
            </Button>

            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick("github")}
            >
                <FaGithub className="h-5 w-5"/>                
            </Button>
            
        </div>
        </Suspense>
    );
};