import LoginRequired from "components/account/LoginRequired";
import Search from "components/search/Search";
import React from "react";

export default function SearchesPage() {
  return (
    <LoginRequired>
      <Search />
    </LoginRequired>
  );
}
