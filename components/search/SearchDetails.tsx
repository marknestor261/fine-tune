import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import DetailsPage from "components/DetailsPage";
import FileMetadata from "components/files/FileMetadata";
import Loading from "components/Loading";
import ShowRequestExample from "components/ShowRequestExample";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWRImmutable from "swr/immutable";
import type { OpenAI } from "types/openai";

export default function SearchDetails({ id }: { id: string }) {
  const { data: file, error } = useSWRImmutable<OpenAI.File>(`files/${id}`);

  return (
    <DetailsPage name="search" id={id} error={error}>
      <SearchForm id={id} />
      {file ? <FileMetadata file={file} /> : <Loading />}
    </DetailsPage>
  );
}

function SearchForm({ id }: { id: string }) {
  const engine: OpenAI.Engine = "davinci";
  const form = useForm({ defaultValues: { query: "" } });
  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Search.Response[]>([]);

  form.watch("query");

  const request = {
    url: `https://api.openai.com/v1/engines/${engine}/search`,
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: { file: id, query: form.getValues().query },
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
          <Input
            autoFocus
            label="Search query"
            bordered
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
          Search
        </Button>
      </form>
      {results.map((result, i) => (
        <SearchResult key={i} results={result} />
      ))}
      <ShowRequestExample request={request} />
    </>
  );
}

function SearchResult({ results }: { results: OpenAI.Search.Response }) {
  return (
    <div className="border rounded-xl shadow-sm p-4 space-y-1">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Score</th>
            <th>Document</th>
          </tr>
        </thead>
        <tbody>
          {results.data.map((result) => (
            <tr key={result.document}>
              <td className="align-top">{result.score.toFixed(2)}</td>
              <td className="truncate-2-lines  ">{result.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
