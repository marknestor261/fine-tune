import LoginRequired from "components/account/LoginRequired";
import ClassificationDetail from "components/classifications/ClassificationDetail";
import { useRouter } from "next/router";
import React from "react";

export default function ClassificationsPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <LoginRequired>
      {id && <ClassificationDetail id={String(id)} />}
    </LoginRequired>
  );
}
