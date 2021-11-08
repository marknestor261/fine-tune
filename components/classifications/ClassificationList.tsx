import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import UsageInstructions from "components/UsageInstructions";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";
import Instructions from "./instructions.mdx";

export default function ClassificationList() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <main className="max-w-4xl mx-auto">
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h1 className="text-3xl">{t("pages.classifications")}</h1>
          <UploadFileButton
            purpose="classifications"
            fields={["text", "label"]}
          />
        </div>
        <FileListTable
          purpose="classifications"
          onClick={(file) => router.push(`/classifications/${file.id}`)}
        />
      </section>
      <UsageInstructions>
        <Instructions />
      </UsageInstructions>
    </main>
  );
}
