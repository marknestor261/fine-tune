import LoginRequired from "components/account/LoginRequired";
import SearchDetails from "components/search/SearchDetails";
import { useRouter } from "next/dist/client/router";
import React from "react";

export default function SearchPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <LoginRequired>
      <SearchDetails id={String(id)} />
    </LoginRequired>
  );
}
