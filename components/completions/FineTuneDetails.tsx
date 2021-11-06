import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Link, Modal, Textarea } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import ErrorMessage from "components/ErrorMessage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import type { OpenAI } from "types/openai";

export default function FindTuneDetails({
  fineTune,
  onClose,
}: {
  fineTune: OpenAI.FineTune | null;
  onClose: () => void;
}) {
  const form = useForm({ defaultValues: { prompt: "" } });
  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Completions.Response>();
  const [error, setError] = useState<string>();

  const onSubmit = form.handleSubmit(async ({ prompt }) => {
    const request: OpenAI.Completions.Request = {
      model: fineTune?.fine_tuned_model,
      prompt,
      n: 3,
      temperature: 0.8,
      max_tokens: 30,
    };
    const response = await fetch(`https://api.openai.com/v1/completions`, {
      headers: { ...headers, "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(request),
    });
    if (response.ok) {
      const json = await response.json();
      setResults(json);
      setError(undefined);
    } else {
      const { error } = (await response.json()) as OpenAI.ErrorResponse;
      setResults(undefined);
      setError(error.message);
    }
  });

  return (
    <Modal
      open={!!fineTune}
      closeButton
      onClose={onClose}
      autoMargin
      fullScreen
    >
      <form onSubmit={onSubmit}>
        <Modal.Header>
          <h3>Fine Tune Model</h3>
        </Modal.Header>
        <Divider />
        <Modal.Body>
          <fieldset>
            <Textarea
              autoFocus
              label="Text to complete"
              bordered
              minRows={4}
              width="100%"
              {...form.register("prompt")}
            />
          </fieldset>
          {error && <ErrorMessage error={error} />}
          {fineTune && <FineTuneMetadata fineTune={fineTune} />}
          {results && <CompletionResults results={results} />}
        </Modal.Body>
        <Divider />
        <Modal.Footer justify="space-between">
          <Button auto bordered onClick={onClose}>
            Close
          </Button>
          <Button
            auto
            iconRight={<FontAwesomeIcon icon={faChevronRight} />}
            loading={form.formState.isSubmitting}
            type="submit"
          >
            Complete
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

function FineTuneMetadata({ fineTune }: { fineTune: OpenAI.FineTune }) {
  const { headers } = useAuthentication();
  const resultFile = fineTune.result_files[0];
  const { data: resultBlob } = useSWR(
    resultFile ? `files/${resultFile.id}/content` : null,
    (resource: string) =>
      fetch(`https://api.openai.com/v1/${resource}`, { headers }).then(
        (response) => response.blob()
      ),
    { revalidateOnFocus: false }
  );

  function download({ file, content }: { file: OpenAI.File; content: Blob }) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.type = "text/csv";
    link.download = file.filename;
    link.click();
  }

  return (
    <table className="w-full">
      <tbody>
        <tr>
          <th>ID</th>
          <td>{fineTune.id}</td>
        </tr>
        <tr>
          <th>Engine</th>
          <td>{fineTune.model}</td>
        </tr>
        <tr>
          <th>Training Files</th>
          <td>
            {fineTune.training_files.map(({ filename }) => filename).join(" ")}
          </td>
        </tr>
        <tr>
          <th>Validation Files</th>
          <td>
            {fineTune.validation_files
              .map(({ filename }) => filename)
              .join(" ") || "None"}
          </td>
        </tr>
        <tr>
          <th>Updated</th>
          <td>{new Date(fineTune.updated_at * 1000).toLocaleString()}</td>
        </tr>
        {resultFile && resultBlob && (
          <tr>
            <th>Result Files</th>
            <td>
              <Link
                className="flex gap-2"
                color="primary"
                onClick={(event) => {
                  event.preventDefault();
                  download({ file: resultFile, content: resultBlob });
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
                Download
              </Link>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function CompletionResults({
  results,
}: {
  results: OpenAI.Completions.Response;
}) {
  return (
    <div>
      <h4 className="my-2">Completions:</h4>
      <ol>
        {results.choices.map((choice, index) => (
          <li key={index} className="truncate-4-lines">
            {choice.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
