"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState, useTransition } from "react"
import { useParams } from "next/navigation"

import { Translate } from "@/lib/i18n/client"
import { ResetSchema } from "@/schemas/auth"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"
import { reset } from "@/action/auth/reset"
import Link from "next/link"


export const ResetForm = () => {
	const params = useParams<{ lng: string; }>()
	const { t } = Translate(params.lng)

	const [error,setError] = useState<string | undefined>("");
	const [success,setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: "",
		}
	})

const onSubmit = (values: z.infer<typeof ResetSchema>) => {
	setError("")
	setSuccess("")

	startTransition(() => {
		reset(values,params.lng)
			.then((data) =>{
				setError(data?.error)
				setSuccess(data?.success)
			})
	  });
}

  return (    
		<CardWrapper
			titleLabel={t('authreset')}
			headerLabel={t("Forgotpassword")}
			backButtonLabel={t('backtologin')}
			backButtonHref={`/${params.lng}/register`}
		>
			<Form {...form}>
				<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
				>
				<div className="space-y-4">
					<FormField 
						control={form.control}
						name="email" 
						render={({field}) => (
							<FormItem>
								<FormLabel>{t('Email')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										disabled={isPending}
										placeholder="john.doe@example.com"
										type="email"
									/>
								</FormControl>
								<FormMessage/>
							</FormItem>
						)}
					/>					
				</div>
				<FormError message={error}/>
				<FormSuccess message={success}/>
				<Button
					disabled={isPending}
					type="submit"
					className="w-full"
				>
					 {t('sendresetemail')}
				</Button>

				</form>
			</Form>
		</CardWrapper>
  );
};

