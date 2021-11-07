import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Textarea } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import DetailsPage from "components/DetailsPage";
import InfoCard from "components/InfoCard";
import RequestCode from "components/RequestCode";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWRImmutable from "swr/immutable";
import type { OpenAI } from "types/openai";
import FineTuneMetadata from "./FineTuneMetadata";
import FineTuneResultFile from "./FineTuneResults";

export default function FineTuneDetails({ id }: { id: string }) {
  const { data: fineTune, error } = useSWRImmutable<OpenAI.FineTune>(
    `fine-tunes/${id}`
  );

  return (
    <DetailsPage name="fine-tune" id={id} error={error}>
      {fineTune && (
        <>
          <FineTuneForm fineTune={fineTune} />
          <FineTuneMetadata fineTune={fineTune} />
          <FineTuneResultFile fineTune={fineTune} />
        </>
      )}
    </DetailsPage>
  );
}

function FineTuneForm({ fineTune }: { fineTune: OpenAI.FineTune }) {
  const form = useForm({ defaultValues: { prompt: "" } });
  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Completions.Response[]>([]);

  form.watch("prompt");

  const request = {
    url: `https://api.openai.com/v1/completions`,
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: {
      model: fineTune.fine_tuned_model,
      prompt: form.getValues().prompt,
      n: 3,
      temperature: 0.8,
      max_tokens: 30,
    },
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
            label="Text to complete"
            bordered
            minRows={4}
            width="100%"
            {...form.register("prompt")}
          />
        </fieldset>
        <Button
          auto
          iconRight={<FontAwesomeIcon icon={faChevronRight} />}
          loading={form.formState.isSubmitting}
          type="submit"
        >
          Complete
        </Button>
      </form>
      {results.map((result, index) => (
        <CompletionResults key={index} results={result} />
      ))}
      <RequestCode request={request} />
    </>
  );
}

function CompletionResults({
  results,
}: {
  results: OpenAI.Completions.Response;
}) {
  return (
    <InfoCard>
      <h4 className="my-4">⭐️ Completions</h4>
      <ol>
        {results.choices.map((choice, index) => (
          <li key={index} className="truncate-4-lines my-4">
            {choice.text}
          </li>
        ))}
      </ol>
    </InfoCard>
  );
}
