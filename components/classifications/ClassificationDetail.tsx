import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Loading, Textarea } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import DetailsPage from "components/DetailsPage";
import FileMetadata from "components/files/FileMetadata";
import InfoCard from "components/InfoCard";
import ShowRequestExample from "components/ShowRequestExample";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWRImmutable from "swr/immutable";
import type { OpenAI } from "types/openai";

export default function ClassificationDetail({ id }: { id: string }) {
  const { data: file, error } = useSWRImmutable<OpenAI.File>(`files/${id}`);

  return (
    <DetailsPage name="classifications" id={id} error={error}>
      <ClassificationForm id={id} />
      {file ? <FileMetadata file={file} /> : <Loading />}
    </DetailsPage>
  );
}

function ClassificationForm({ id }: { id: string }) {
  const form = useForm({ defaultValues: { query: "" } });
  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Classifications.Response[]>([]);

  form.watch("query");

  const request = {
    url: "https://api.openai.com/v1/classifications",
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: { file: id, model: "davinci", query: form.getValues().query },
  };

  const onSubmit = form.handleSubmit(async () => {
    const { url, body, ...init } = request;
    const response = await fetch(url, { ...init, body: JSON.stringify(body) });
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
      <ShowRequestExample request={request} />
    </>
  );
}

function ClassificationResult({
  results,
}: {
  results: OpenAI.Classifications.Response;
}) {
  return (
    <InfoCard>
      <h3>
        <span className="font-normal">Label:</span> {results.label}
      </h3>
      <table className="w-full text-left">
        <caption className="text-left my-2">Based on:</caption>
        <thead>
          <tr>
            <th>Label</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {results.selected_examples.map((example) => (
            <tr key={example.document}>
              <td className="align-top">
                {example.label} ({example.score.toFixed(2)})
              </td>
              <td className="line-clamp-4">{example.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </InfoCard>
  );
}
