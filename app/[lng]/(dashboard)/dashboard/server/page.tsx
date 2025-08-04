'use server'

import { UserInfo } from "@/components/auth/user-info";
import { currentUser } from "@/lib/auth/user";

const TestServerPage = async () => {
  const user = await currentUser();

  return (
    <div className="p-4">
    
      <UserInfo
        label="Server components"
        user = {user ?? undefined}
      />
    </div>
  );
};

export default TestServerPage;