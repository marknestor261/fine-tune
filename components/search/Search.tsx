import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import React, { useState } from "react";
import type { OpenAI } from "types/openai";
import TestSearch from "./TestSearch";

export default function Searches() {
  const [file, setFile] = useState<OpenAI.File | null>(null);

  return (
    <main>
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h1>Search</h1>
          <UploadFileButton purpose="search" />
        </div>
        <FileListTable purpose="search" onClick={setFile} />
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
      <TestSearch file={file} onClose={() => setFile(null)} />
    </main>
  );
}
