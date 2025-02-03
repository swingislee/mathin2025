"use client"

import * as z from "zod"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState, useTransition } from "react"

import { Translate } from "@/lib/i18n/client"
import { NewPasswordSchema } from "@/schemas/auth"
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
import { CardWrapper } from "./card-wrapper"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"
import { newPassword } from "@/action/auth/new-password"

interface ParamsProps {
  lng: string;
  token: string;
}

export const NewPasswordForm = ({ lng, token }: ParamsProps) => {
	const { t } = Translate(lng)

	const [error, setError] = useState<string | undefined>("")
	const [success, setSuccess] = useState<string | undefined>("")
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: "",
		},
	})

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		setError("")
		setSuccess("")

		startTransition(() => {
			newPassword(values, token, lng).then((data) => {
				setError(data?.error)
				setSuccess(data?.success)
			})
		})
	}

	return (
		<CardWrapper
			titleLabel={t("authreset")}
			headerLabel={t("enteranewpassword")}
			backButtonLabel={t("backtologin")}
			backButtonHref={`/${lng}/login`}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("password")}</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={isPending}
											placeholder="******"
											type="password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button disabled={isPending} type="submit" className="w-full">
						{t("resetpassword")}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}


