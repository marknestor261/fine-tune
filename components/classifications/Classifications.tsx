import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import React, { useState } from "react";
import type { OpenAI } from "types/openai";
import Instructions from "./instructions.mdx";
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
        <Instructions />
      </section>
      <TestClassification file={file} onClose={() => setFile(null)} />
    </main>
  );
}
