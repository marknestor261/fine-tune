import LoginRequired from "components/account/LoginRequired";
import FineTuneDetails from "components/fine-tunes/FineTuneDetails";
import { useRouter } from "next/router";
import React from "react";

export default function CompletionsPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <LoginRequired>{id && <FineTuneDetails id={String(id)} />}</LoginRequired>
  );
}
