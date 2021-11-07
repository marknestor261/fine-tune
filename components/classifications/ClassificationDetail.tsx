import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Loading, Textarea } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import ErrorMessage from "components/ErrorMessage";
import FileMetadata from "components/files/FileMetadata";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";
import type { OpenAI } from "types/openai";

export default function ClassificationDetail({ id }: { id: string }) {
  const { data: file, error } = useSWR<OpenAI.File>(`files/${id}`);

  return (
    <main className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl">
        <span className="font-normal">Classifications</span> {id}
      </h1>
      {error && <ErrorMessage error={error} />}
      <ClassificationForm id={id} />
      {file ? <FileMetadata file={file} /> : <Loading />}
    </main>
  );
}

function ClassificationForm({ id }: { id: string }) {
  const form = useForm({ defaultValues: { query: "" } });
  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Classifications.Response>();

  const onSubmit = form.handleSubmit(async ({ query }) => {
    const request: OpenAI.Classifications.Request = {
      file: id,
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
    } else {
      const { error } = (await response.json()) as OpenAI.ErrorResponse;
      toast.error(error.message);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
      <Button
        auto
        iconRight={<FontAwesomeIcon icon={faChevronRight} />}
        loading={form.formState.isSubmitting}
        type="submit"
      >
        Classify
      </Button>
      {results && <ClassificationResult results={results} />}
    </form>
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
        <b>Label:</b> {results.label}
      </p>
      <table className="w-full text-left">
        <caption className="text-left font-bold my-2">Based on:</caption>
        <thead>
          <th>Label</th>
          <th>Example</th>
        </thead>
        <tbody>
          {results.selected_examples.map((example) => (
            <tr key={example.document}>
              <th className="align-top">
                {example.label} ({example.score.toFixed(2)})
              </th>
              <td className="truncate-2-lines  ">{example.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
