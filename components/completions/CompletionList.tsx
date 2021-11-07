import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import React from "react";
import { useTranslation } from "react-i18next";
import CreateCompletionButton from "./CreateCompletionButton";
import FineTunes from "./FineTunes";

export default function ClassificationList() {
  const { t } = useTranslation();

  return (
    <main className="max-w-4xl mx-auto">
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h1 className="text-3xl">{t("pages.search")}</h1>
          <CreateCompletionButton />
        </div>
        <FineTunes />
      </section>
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h3>Training Files</h3>
          <UploadFileButton purpose="fine-tune" />
        </div>
        <FileListTable purpose="fine-tune" />
      </section>
      <section className="prose mt-12 text-sm">{/* Instructions */}</section>
    </main>
  );
}
