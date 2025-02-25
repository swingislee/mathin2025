'use client'

import { UserInfo } from "@/components/auth/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const TestClientPage = () => {
  const user =  useCurrentUser();

  return (
    <div className="p-4">
    
      <UserInfo
        label="Client components"
        user = {user}
      />
    </div>
  );
};

export default TestClientPage;