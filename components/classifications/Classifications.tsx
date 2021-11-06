import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import React, { useState } from "react";
import type { OpenAI } from "types/openai";
import TestClassification from "./TestClassification";

export default function Classifications() {
  const [file, setFile] = useState<OpenAI.File | null>(null);

  return (
    <main>
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h1>Classifications</h1>
          <UploadFileButton purpose="classifications" />
        </div>
        <FileListTable purpose="classifications" onClick={setFile} />
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
      <TestClassification file={file} onClose={() => setFile(null)} />
    </main>
  );
}
