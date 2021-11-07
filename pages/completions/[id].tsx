import LoginRequired from "components/account/LoginRequired";
import FineTuneDetails from "components/completions/FineTuneDetails";
import { useRouter } from "next/dist/client/router";
import React from "react";

export default function CompletionsPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <LoginRequired>
      <FineTuneDetails id={String(id)} />
    </LoginRequired>
  );
}
