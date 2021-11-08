import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import FineTuneList from "components/fine-tunes/FineTuneList";
import React from "react";
import { useTranslation } from "react-i18next";
import CreateCompletionButton from "./CreateCompletionButton";

export default function ClassificationList() {
  const { t } = useTranslation();

  return (
    <main className="max-w-4xl mx-auto">
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h1 className="text-3xl">{t("pages.completions")}</h1>
          <CreateCompletionButton />
        </div>
        <FineTuneList />
      </section>
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h3>Training Files</h3>
          <UploadFileButton
            purpose="fine-tune"
            fields={["prompt", "completion"]}
          />
        </div>
        <FileListTable purpose="fine-tune" />
      </section>
    </main>
  );
}
