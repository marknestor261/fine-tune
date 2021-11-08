import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";
import Instructions from "./instructions.mdx";

export default function SearchList() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <main className="max-w-4xl mx-auto">
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h1 className="text-3xl">{t("pages.search")}</h1>
          <UploadFileButton purpose="search" />
        </div>
        <FileListTable
          purpose="search"
          onClick={(file) => router.push(`/search/${file.id}`)}
        />
      </section>
      <section className="prose mt-12 text-sm">
        <Instructions />
      </section>
    </main>
  );
}
