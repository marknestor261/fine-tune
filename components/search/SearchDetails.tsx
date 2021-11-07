import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import DetailsPage from "components/DetailsPage";
import FileMetadata from "components/files/FileMetadata";
import Loading from "components/Loading";
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

  const onSubmit = form.handleSubmit(async ({ query }) => {
    const request: OpenAI.Search.Request = { file: id, query };
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
    </>
  );
}

function SearchResult({ results }: { results: OpenAI.Search.Response }) {
  return (
    <div className="border rounded-xl shadow-sm p-4 space-y-1">
      <table className="w-full text-left">
        <thead>
          <th>Score</th>
          <th>Document</th>
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
