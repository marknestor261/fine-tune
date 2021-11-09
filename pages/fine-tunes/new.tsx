import LoginRequired from "components/account/LoginRequired";
import NewFineTuneForm from "components/fine-tunes/NewFineTuneForm";
import React from "react";

export default function NewFineTunePage() {
  return (
    <LoginRequired>
      <NewFineTuneForm />
    </LoginRequired>
  );
}
