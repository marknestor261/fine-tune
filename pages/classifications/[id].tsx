import LoginRequired from "components/account/LoginRequired";
import ClassificationDetail from "components/classifications/ClassificationDetail";
import { useRouter } from "next/dist/client/router";
import React from "react";

export default function ClassificationsPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <LoginRequired>
      <ClassificationDetail id={String(id)} />
    </LoginRequired>
  );
}
