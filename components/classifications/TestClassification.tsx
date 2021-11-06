import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Modal, Textarea } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import ErrorMessage from "components/ErrorMessage";
import FileMetadata from "components/files/FileMetadata";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { OpenAI } from "types/openai";

export default function TestClassification({
  file,
  onClose,
}: {
  file: OpenAI.File | null;
  onClose: () => void;
}) {
  const form = useForm({ defaultValues: { query: "" } });
  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Classifications.Response>();
  const [error, setError] = useState<string>();

  const onSubmit = form.handleSubmit(async ({ query }) => {
    const request: OpenAI.Classifications.Request = {
      file: file?.id,
      model: "davinci",
      query,
    };
    const response = await fetch("https://api.openai.com/v1/classifications", {
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
    <Modal open={!!file} closeButton onClose={onClose} autoMargin fullScreen>
      <form onSubmit={onSubmit}>
        <Modal.Header>
          <h3>Classification</h3>
        </Modal.Header>
        <Divider />
        <Modal.Body>
          <fieldset>
            <Textarea
              autoFocus
              label="Text to classify"
              bordered
              minRows={4}
              width="100%"
              {...form.register("query")}
            />
          </fieldset>
          {file && <FileMetadata file={file} />}
          {error && <ErrorMessage error={error} />}
          {results && <ClassificationResult results={results} />}
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
            Classify
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

function ClassificationResult({
  results,
}: {
  results: OpenAI.Classifications.Response;
}) {
  return (
    <>
      <p>
        <b>Output:</b> {results.label}
      </p>
      <table className="w-full text-left" cellSpacing={20}>
        <caption className="text-left font-bold my-2">Examples:</caption>
        <tbody>
          {results.selected_examples.map((example) => (
            <tr key={example.document}>
              <td className="align-top">
                {example.label} ({example.score.toFixed(2)})
              </td>
              <td className="truncate-2-lines  ">{example.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
