import LoginRequired from "components/account/LoginRequired";
import Completions from "components/completions/Completions";
import React from "react";

export default function CompletionsPage() {
  return (
    <LoginRequired>
      <Completions />
    </LoginRequired>
  );
}
