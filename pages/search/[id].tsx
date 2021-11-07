import LoginRequired from "components/account/LoginRequired";
import SearchDetails from "components/search/SearchDetails";
import { useRouter } from "next/router";
import React from "react";

export default function SearchPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <LoginRequired>{id && <SearchDetails id={String(id)} />}</LoginRequired>
  );
}
