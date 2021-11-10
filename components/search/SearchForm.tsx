import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import Label from "components/forms/Label";
import SelectEngine from "components/forms/SelectEngine";
import ShowRequestExample from "components/ShowRequestExample";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { OpenAI } from "types/openai";

export default function SearchForm({ id }: { id: string }) {
  const form = useForm({ defaultValues: { engine: "ada", query: "" } });
  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Search.Response[]>([]);

  form.watch();

  const request = {
    url: `https://api.openai.com/v1/engines/${form.getValues().engine}/search`,
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: { file: id, query: form.getValues().query },
  };

  const onSubmit = form.handleSubmit(async () => {
    const { url, body, ...init } = request;
    const response = await fetch(url, {
      ...init,
      body: JSON.stringify({
        ...body,
        max_rerank: 10,
      }),
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
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset>
          <Label label="Search query" required>
            <Input
              autoFocus
              bordered
              required
              width="100%"
              {...form.register("query")}
            />
          </Label>
          <div className="flex gap-8 flex-wrap">
            <Label label="Engine" required>
              <SelectEngine name="engine" required />
            </Label>
          </div>
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
      <ShowRequestExample
        request={request}
        reference="https://beta.openai.com/docs/api-reference/searches/create"
      />
    </FormProvider>
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
              <td className="line-clamp-2">{result.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <b>Model:</b> {results.model}
      </p>
    </div>
  );
}
