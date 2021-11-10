import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import FineTuneList from "components/fine-tunes/FineTuneList";
import UsageInstructions from "components/UsageInstructions";
import router from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";
import Instructions from "./instructions.mdx";

export default function ClassificationList() {
  const { t } = useTranslation();

  return (
    <main className="max-w-4xl mx-auto">
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h1 className="text-3xl">{t("pages.completions")}</h1>
          <Button
            auto
            flat
            size="small"
            icon={<FontAwesomeIcon icon={faPlusCircle} />}
            onClick={() => router.push("/fine-tunes/new")}
          >
            New Model
          </Button>
        </div>
        <FineTuneList />
      </section>
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h2 className="text-3xl">Training Files</h2>
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
