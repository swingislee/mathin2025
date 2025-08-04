"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Suspense, useState, useTransition } from "react"
import { useParams } from "next/navigation"

import { RegisterSchema } from "@/schemas/auth"
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
import { register } from "@/actions/auth/register"
import { BeatLoader } from "react-spinners"

function RegisterFormFallback() {
	return (
			<div className="flex w-full items-center justify-center gap-x-2">
					<BeatLoader className="h-8 w-8"/>
			</div>
	)
}

export const RegisterForm = () => {
	const params = useParams<{ lng: string; }>();

	const [error,setError] = useState<string | undefined>("");
	const [success,setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		}
	})

const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
	setError("")
	setSuccess("")

	startTransition(() => {
		register(values)
			.then((data) =>{
				setError(data.error)
				setSuccess(data.success)
			})
	  });
}

  return (
		<Suspense fallback={<RegisterFormFallback />}>    
		<CardWrapper
			titleLabel="Auth"
			headerLabel="create an account"
			backButtonLabel="Already have an account?"
			backButtonHref={`/${params.lng}/login`}
			showSocial
		>
			<Form {...form}>
				<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
				>
				<div className="space-y-2">
					<FormField 
						control={form.control}
						name="name" 
						render={({field}) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										disabled={isPending}
										placeholder="john.doe"
										type="name"
									/>
								</FormControl>
								<FormMessage/>
							</FormItem>
						)}
					/>
					<FormField 
						control={form.control}
						name="email" 
						render={({field}) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										{...field}
										disabled={isPending}
										placeholder="john.doe@qq.com"
										type="email"
									/>
								</FormControl>
								<FormMessage/>
							</FormItem>
						)}
					/>
					<FormField 
						control={form.control}
						name="password" 
						render={({field}) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										{...field}
										disabled={isPending}
										placeholder="******"
										type="password"
									/>
								</FormControl>
								
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
					 create a new account
				</Button>

				</form>
			</Form>
		</CardWrapper>

		</Suspense>
  );
};

