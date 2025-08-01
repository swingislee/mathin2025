"use client";

import { useParams, useSearchParams } from "next/navigation";
import { FaWeixin } from "react-icons/fa";
import { BsTencentQq } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Suspense } from "react";

function SocialFallback() {
  return (
    <div className="flex w-full items-center justify-center gap-x-2">
      <Button size="lg" className="w-full" variant="outline" disabled>
        <FaWeixin className="h-5 w-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" disabled>
        <BsTencentQq className="h-5 w-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" disabled>
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
}

export const Social = () => {
  const params = useParams<{ lng: string }>();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") ||
    `/${params.lng}${DEFAULT_LOGIN_REDIRECT}`;

  const supabase = createClient();

  const handleOAuth = async (provider: "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider, // Using GitHub OAuth provider
      options: { redirectTo: callbackUrl },
    });
    if (error) {
      console.error("Social sign-in error:", error.message);
      // Handle error (e.g., display a message)
    }
  };

  return (
    <Suspense fallback={<SocialFallback />}>
      <div className="flex w-full items-center justify-center gap-x-2">
        {/* Only GitHub is supported for OAuth */}
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => handleOAuth("github")}
        >
          <FaGithub className="h-5 w-5" />
        </Button>
      </div>
    </Suspense>
  );
};
