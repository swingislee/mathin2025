"use client"

import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "../ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";
import { title } from "process";

interface CardWrapperProps {
  children: React.ReactNode;  
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  titleLabel: string;
}

export const CardWrapper = ({
  children,
  headerLabel, 
  backButtonLabel,
  backButtonHref,
  showSocial,
  titleLabel
}: CardWrapperProps) => {
  return(
    <Card className="w-[370px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} title={titleLabel}/>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social/>
        </CardFooter>
      )}
      <BackButton
        label={backButtonLabel}
        href={backButtonHref}
      />    
    </Card>   
  )  
}