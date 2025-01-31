"use client"
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Translate } from "@/lib/i18n/client";

import { FaWeixin } from "react-icons/fa";
import { BsTencentQq } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
// import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";



export const Social = () => {
    const params = useParams<{ lng: string; }>()
	const { t } = Translate(params.lng)
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    
    const onClick = (provider: "wechat" | "qq" | "github") => {
        // signIn(provider,{
        //     callbackUrl: callbackUrl || `/${params.lng}${DEFAULT_LOGIN_REDIRECT}`
        // })
    }
    return(
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
    );
};