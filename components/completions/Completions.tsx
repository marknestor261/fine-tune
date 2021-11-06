import FileListTable from "components/files/FileListTable";
import UploadFileButton from "components/files/UploadFileButton";
import React, { useState } from "react";
import type { OpenAI } from "types/openai";
import CreateCompletionButton from "./CreateCompletionButton";
import FindTuneDetails from "./FineTuneDetails";
import FineTunes from "./FineTunes";

export default function Classifications() {
  const [fineTune, setFineTune] = useState<OpenAI.FineTune | null>(null);

  return (
    <main>
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h1>Completions</h1>
          <CreateCompletionButton />
        </div>
        <FineTunes onClick={setFineTune} />
      </section>
      <section>
        <div className="flex flex-nowrap justify-between items-center">
          <h3>Training Files</h3>
          <UploadFileButton purpose="fine-tune" />
        </div>
        <FileListTable purpose="fine-tune" />
      </section>
      <section className="prose mt-12 text-sm">{/* Instructions */}</section>
      <FindTuneDetails fineTune={fineTune} onClose={() => setFineTune(null)} />
    </main>
  );
}
