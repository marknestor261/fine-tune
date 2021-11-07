import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import parse from "csv-parse/lib/sync";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useSWRImmutable from "swr/immutable";
import { OpenAI } from "types/openai";

export default function FineTuneResultFile({ file }: { file: OpenAI.File }) {
  const { headers } = useAuthentication();
  const [showResults, setShowResults] = useState(true);

  const { data: results } = useSWRImmutable<
    Array<{
      elapsed_examples: string;
      elapsed_tokens: string;
      step: string;
      training_loss: string;
      training_sequence_accuracy: string;
      training_token_accuracy: string;
    }>
  >(`files/${file.id}/content`, async () => {
    const response = await fetch(
      `https://api.openai.com/v1/files/${file.id}/content`,
      { headers }
    );
    const raw = response.ok ? await response.text() : null;
    return (
      raw &&
      parse(raw, {
        columns: true,
        skip_empty_lines: true,
      })
    );
  });

  async function download(file: OpenAI.File) {
    const response = await fetch(
      `https://api.openai.com/v1/files/${file.id}/content`,
      { headers }
    );
    if (!response.ok) {
      toast.error(`Failed to download ${file.filename}`);
      return;
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.type = "text/csv";
    link.download = file.filename;
    link.click();
  }

  return (
    <div className="border rounded-xl shadow-xl max-w-md p-4 space-y-1">
      <h4>
        Results File
        {results && (
          <span className="ml-2 font-thin">{results.length} records</span>
        )}
      </h4>
      <div className="flex gap-4 justify-between">
        {file && (
          <Button
            flat
            icon={<FontAwesomeIcon icon={faDownload} />}
            size="small"
            onClick={(event) => {
              event.preventDefault();
              download(file);
            }}
          >
            Download
          </Button>
        )}
        {results && (
          <Button
            flat
            icon={<FontAwesomeIcon icon={faEye} />}
            size="small"
            onClick={(event) => {
              event.preventDefault();
              setShowResults(!showResults);
            }}
          >
            View
          </Button>
        )}
      </div>
      {showResults && results && (
        <table>
          <tbody>
            {results.map((row) => (
              <tr key={row.step}></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
