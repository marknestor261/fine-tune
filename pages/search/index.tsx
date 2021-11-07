import LoginRequired from "components/account/LoginRequired";
import SearchList from "components/search/SearchList";
import React from "react";

export default function SearchPage() {
  return (
    <LoginRequired>
      <SearchList />
    </LoginRequired>
  );
}
