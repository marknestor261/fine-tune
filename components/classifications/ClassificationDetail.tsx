import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Loading, Textarea } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import ErrorMessage from "components/ErrorMessage";
import FileMetadata from "components/files/FileMetadata";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSWRImmutable from "swr/immutable";
import type { OpenAI } from "types/openai";

export default function ClassificationDetail({ id }: { id: string }) {
  const { t } = useTranslation();
  const { data: file, error } = useSWRImmutable<OpenAI.File>(`files/${id}`);

  return (
    <main className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl">
        <span className="font-normal">{t("pages.classifications")}</span> {id}
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
  const [results, setResults] = useState<OpenAI.Classifications.Response[]>([]);

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
      setResults([json, ...results]);
    } else {
      const { error } = (await response.json()) as OpenAI.ErrorResponse;
      toast.error(error.message);
    }
  });

  return (
    <>
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
      </form>
      {results.map((result, index) => (
        <ClassificationResult key={index} results={result} />
      ))}
    </>
  );
}

function ClassificationResult({
  results,
}: {
  results: OpenAI.Classifications.Response;
}) {
  return (
    <div className="border rounded-xl shadow-sm p-4 space-y-1">
      <h3>
        <span className="font-normal">Label:</span> {results.label}
      </h3>
      <table className="w-full text-left">
        <caption className="text-left my-2">Based on:</caption>
        <thead>
          <th>Label</th>
          <th>Example</th>
        </thead>
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
    </div>
  );
}
