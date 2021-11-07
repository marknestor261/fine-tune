import LoginRequired from "components/account/LoginRequired";
import CompletionList from "components/completions/CompletionList";
import React from "react";

export default function CompletionsPage() {
  return (
    <LoginRequired>
      <CompletionList />
    </LoginRequired>
  );
}
