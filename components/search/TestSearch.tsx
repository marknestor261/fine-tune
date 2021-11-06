import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Input, Modal } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import ErrorMessage from "components/ErrorMessage";
import FileMetadata from "components/files/FileMetadata";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { OpenAI } from "types/openai";

export default function TestSearch({
  file,
  onClose,
}: {
  file: OpenAI.File | null;
  onClose: () => void;
}) {
  const engine: OpenAI.Engine = "davinci";
  const form = useForm({ defaultValues: { query: "" } });
  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Search.Response>();
  const [error, setError] = useState<string>();

  const onSubmit = form.handleSubmit(async ({ query }) => {
    const request: OpenAI.Search.Request = {
      file: file?.id,
      query,
    };
    const response = await fetch(
      `https://api.openai.com/v1/engines/${engine}/search`,
      {
        headers: { ...headers, "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(request),
      }
    );
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
          <h3>Search</h3>
        </Modal.Header>
        <Divider />
        <Modal.Body>
          <fieldset>
            <Input
              autoFocus
              label="Search query"
              bordered
              width="100%"
              {...form.register("query")}
            />
          </fieldset>
          {file && <FileMetadata file={file} />}
          {error && <ErrorMessage error={error} />}
          {results && <SearchResult results={results} />}
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
            Search
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

function SearchResult({ results }: { results: OpenAI.Search.Response }) {
  return (
    <table className="w-full text-left" cellSpacing={20}>
      <caption className="text-left font-bold my-2">Results:</caption>
      <tbody>
        {results.data.map((result) => (
          <tr key={result.document}>
            <td className="align-top">{result.score.toFixed(2)}</td>
            <td className="truncate-2-lines  ">{result.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
