import LoginRequired from "components/account/LoginRequired";
import ClassificationList from "components/classifications/ClassificationList";
import React from "react";

export default function ClassificationsPage() {
  return (
    <LoginRequired>
      <ClassificationList />
    </LoginRequired>
  );
}
