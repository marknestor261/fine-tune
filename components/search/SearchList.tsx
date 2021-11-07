import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

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
        <p>
          To search, upload a file that contains multiple documents. Each record
          has a <code>text</code> field with the document text. Currently only
          support JSONL files. For more details and examples, refer to the{" "}
          <a
            href="https://beta.openai.com/docs/guides/searches"
            target="_blank"
            rel="noreferrer"
          >
            OpenAI docs
          </a>
          .
        </p>
        <p>
          Click on the searches file ID in the table to open the test UI. From
          there, you can do a search and see which documents match and their
          match score.
        </p>
      </section>
    </main>
  );
}
