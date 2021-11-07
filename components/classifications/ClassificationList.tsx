import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import { useRouter } from "next/dist/client/router";
import React from "react";

export default function ClassificationList() {
  const router = useRouter();

  return (
    <main className="max-w-4xl mx-auto">
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h1 className="text-3xl">Classifications</h1>
          <UploadFileButton purpose="classifications" />
        </div>
        <FileListTable
          purpose="classifications"
          onClick={(file) => router.push(`/classifications/${file.id}`)}
        />
      </section>
      <section className="prose mt-12 text-sm">
        <p>
          Upload files with a list of label records. Each record contains
          <code>text</code>, <code>label</code>, and optional{" "}
          <code>metadata</code> fields. Currently only support JSONL files. For
          more details and examples, refer to the{" "}
          <a
            href="https://beta.openai.com/docs/guides/classifications"
            target="_blank"
            rel="noreferrer"
          >
            OpenAI docs
          </a>
          .
        </p>
        <p>
          Click on the classifications file ID in the table to open the test UI.
          From there, you can enter some text and see how it gets classified,
          and examples used for classification.
        </p>
      </section>
    </main>
  );
}
