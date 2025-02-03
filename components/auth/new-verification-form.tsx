"use client";

import { BeatLoader } from "react-spinners"

import { newVerification } from "@/action/auth/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

import { useCallback, useEffect,useRef,useState } from "react";

interface ParamsProps {
  lng: string;
  token: string;
}

export const NewVerificationForm  = ({ lng, token }: ParamsProps) => {

  const [error , setError] = useState<string | undefined>();
  const [success , setSuccess] = useState<string | undefined>();

  const lastAttemptedToken = useRef<string | null>(null);

  const onSubmit = useCallback(() => {
    if(!token || token === lastAttemptedToken.current) return;

    lastAttemptedToken.current = token;

    newVerification(token)
      .then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(() =>{
        setError("Something went wrong!")
      })
  },[token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div>
        <CardWrapper
            headerLabel="Confirming your verification"
            titleLabel="Auth"
            backButtonHref={`/${lng}/login`}
            backButtonLabel="Back to login"            
        > 
            <div className="flex items-center w-full justify-center">              
              {!success && !error && (<BeatLoader/>)}
              
		      		<FormSuccess message={success}/>
              {!success && (
                <FormError message={error}/>
              )}
            </div> 
        </CardWrapper>
    </div>
  );
};