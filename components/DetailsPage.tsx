import React from "react";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";

export default function DetailsPage({
  id,
  name,
  error,
  children,
}: {
  id: string;
  name: string;
  error?: Error;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <main className="max-w-2xl mx-auto space-y-8 mb-8">
      <h1 className="text-3xl">
        <span className="font-normal">{t(`pages.${name}`)}</span> {id}
      </h1>
      {error && <ErrorMessage error={error} />}
      {children}
    </main>
  );
}
