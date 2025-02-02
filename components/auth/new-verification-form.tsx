"use client";

import { BeatLoader } from "react-spinners"

import { newVerification } from "@/action/auth/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect,useRef,useState } from "react";
import { Translate } from "@/lib/i18n/client";

export const NewVerificationForm  = () => {
	const params = useParams<{ lng: string; }>()
	const { t } = Translate(params.lng)

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error , setError] = useState<string | undefined>();
  const [success , setSuccess] = useState<string | undefined>();

  const lastAttemptedToken = useRef<string | null>(null);

  const onSubmit = useCallback(() => {
    if(!token || token === lastAttemptedToken.current) return;

    lastAttemptedToken.current = token;

    console.timeLog

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
            backButtonHref={`/${params.lng}/login`}
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