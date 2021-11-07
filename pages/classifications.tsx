import LoginRequired from "components/account/LoginRequired";
import Classifications from "components/classifications/Classifications";
import React from "react";

export default function ClassificationsPage() {
  return (
    <LoginRequired>
      <Classifications />
    </LoginRequired>
  );
}
