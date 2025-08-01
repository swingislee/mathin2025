"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { SettingsSchema } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

// Ensure your Zod schema still includes only: name, email, password, newPassword
// e.g. export const SettingsSchema = z.object({
//   name: z.string().min(1),
//   email: z.string().email(),
//   password: z.string().optional(),
//   newPassword: z.string().optional(),
// });

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  // 1. 在客户端初始化时拉取当前用户
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ); // :contentReference[oaicite:0]{index=0}

    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        console.error("获取当前用户失败：", error);
      } else {
        setUser(user);
      }
    }); // :contentReference[oaicite:1]{index=1}
  }, []);

  // 2. 当 user 加载完成后，用它来重置表单初始值
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: undefined,
      newPassword: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.user_metadata?.name || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  // 3. 提交时调用 supabase.auth.updateUser()
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ); // :contentReference[oaicite:2]{index=2}

      // 构造更新负载：仅推送发生变更的字段
      const payload: Record<string, any> = {};
      if (values.name) payload.data = { name: values.name };
      if (values.newPassword) payload.password = values.newPassword;

      const { error: updateError } = await supabase.auth.updateUser(payload); // :contentReference[oaicite:3]{index=3}
      if (updateError) {
        setError(updateError.message);
        setSuccess(undefined);
      } else {
        setSuccess("Settings updated successfully");
        setError(undefined);
      }
    });
  };

  return (
    <div className="flex flex-col p-4 rounded-2xl items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p>Settings</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormError message={error} />
              <FormSuccess message={success} />

              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
