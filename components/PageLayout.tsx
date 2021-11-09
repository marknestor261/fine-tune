import NextLink from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import useAuthentication from "./account/useAuthentication";

const navigation = [
  { completions: "/completions/" },
  { classifications: "/classifications/" },
  { search: "/search/" },
];

export default function PageLayout({
  children,
  fullPage,
}: {
  children: React.ReactNode;
  fullPage?: boolean;
}) {
  const { signOut } = useAuthentication();
  const { ready } = useTranslation();
  if (!ready) return null;

  return (
    <div className={"container mx-auto p-4"}>
      {fullPage ? null : <PageHeader signOut={signOut} />}
      {children}
    </div>
  );
}

function PageHeader({ signOut }: { signOut: () => void }) {
  const { t } = useTranslation();

  return (
    <header className="mb-8 flex flex-wrap justify-between items-center gap-4 text-xl">
      <NextLink href="/">
        <a className="whitespace-nowrap text-black flex gap-2">
          <span className="font-bold flex flex-no-wrap gap-2">
            <span>{t("app.emoji")}</span>
            <span>{t("app.name")}</span>
          </span>
          <span className="font-light">{t("app.subtitle")}</span>
        </a>
      </NextLink>
      <nav className="space-x-4 whitespace-nowrap">
        {navigation.map((object) =>
          Object.entries(object).map(([key, href]) => (
            <NextLink href={href} key={href}>
              <a>{t(`pages.${key}`)}</a>
            </NextLink>
          ))
        )}
      </nav>
      <button onClick={signOut} className="text-base">
        Sign Out
      </button>
    </header>
  );
}
