"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { User } from "@supabase/supabase-js";

interface UserInfoProps {
  user?: User;
  label: string;
}

const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
    <p className="text-sm font-medium">{label}</p>
    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
      {value ?? "—"}
    </p>
  </div>
);

export const UserInfo: React.FC<UserInfoProps> = ({ user, label }) => {
  return (
    <Card>
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow label="ID" value={user?.id} />
        <InfoRow label="Name" value={user?.user_metadata?.name} />
        <InfoRow label="Email" value={user?.email} />
        <InfoRow
          label="Created At"
          value={user?.created_at && new Date(user.created_at).toLocaleString()}
        />
      </CardContent>
    </Card>
  );
};
