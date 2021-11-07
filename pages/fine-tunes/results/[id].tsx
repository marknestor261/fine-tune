import LoginRequired from "components/account/LoginRequired";
import FineTuneResultFile from "components/fine-tunes/FineTuneResultFile";
import { useRouter } from "next/router";
import React from "react";

export default function CompletionsPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <LoginRequired>
      {id && <FineTuneResultFile id={String(id)} />}
    </LoginRequired>
  );
}

export function getServerSideProps() {
  return {
    props: { fullPage: true },
  };
}
