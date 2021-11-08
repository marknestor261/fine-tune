import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import FineTuneList from "components/fine-tunes/FineTuneList";
import UsageInstructions from "components/UsageInstructions";
import React from "react";
import { useTranslation } from "react-i18next";
import CreateCompletionButton from "./CreateCompletionButton";
import Instructions from "./instructions.mdx";

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
            enforce={{
              required: ["prompt", "completion"],
              count: ["prompt", "completion"],
              maxTokens: 2048,
            }}
          />
        </div>
        <FileListTable purpose="fine-tune" />
      </section>
      <UsageInstructions>
        <Instructions />
      </UsageInstructions>
    </main>
  );
}
