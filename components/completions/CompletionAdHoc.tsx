import React from "react";
import { useTranslation } from "react-i18next";
import CompletionForm from "./CompletionForm";

export default function CompletionAdHoc() {
  const { t } = useTranslation();

  return (
    <main className="max-w-2xl mx-auto space-y-8 mb-8">
      <h1 className="text-3xl">
        <span className="font-normal">{t("pages.completions")}</span> Playground
      </h1>
      <CompletionForm />
    </main>
  );
}
