import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import React, { useState } from "react";
import type { OpenAI } from "types/openai";
import Instructions from "./instructions.mdx";
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
        <Instructions />
      </section>
      <TestSearch file={file} onClose={() => setFile(null)} />
    </main>
  );
}
