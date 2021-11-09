import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Textarea } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import InfoCard from "components/InfoCard";
import ShowRequestExample from "components/ShowRequestExample";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { OpenAI } from "types/openai";

export default function FineTuneForm({
  fineTune,
}: {
  fineTune: OpenAI.FineTune;
}) {
  const form = useForm({
    defaultValues: { prompt: "", max_tokens: 30, temperature: 0.8 },
  });
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
      temperature: +form.getValues().temperature,
      max_tokens: +form.getValues().max_tokens,
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
      <form onSubmit={onSubmit} className="space-y-8">
        <fieldset className="space-y-4">
          <div>
            <Textarea
              autoFocus
              label="Text to complete"
              bordered
              minRows={4}
              width="100%"
              {...form.register("prompt")}
            />
          </div>
          <div className="flex gap-8 flex-wrap">
            <Input
              label="Max Tokens"
              type="number"
              min={10}
              max={2048}
              step={10}
              {...form.register("max_tokens", { min: 10, max: 2048 })}
            />
            <Input
              label="Temperature"
              type="number"
              min={0}
              max={1}
              step={0.1}
              {...form.register("temperature", { min: 0, max: 1 })}
            />
          </div>
        </fieldset>
        <div className="pb-4">
          <Button
            auto
            iconRight={<FontAwesomeIcon icon={faChevronRight} />}
            loading={form.formState.isSubmitting}
            type="submit"
          >
            Complete
          </Button>
        </div>
      </form>
      {results.map((result, index) => (
        <CompletionResults key={index} results={result} />
      ))}
      <ShowRequestExample request={request} />
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
          <li key={index} className="line-clamp-4 my-4">
            {choice.text}
          </li>
        ))}
      </ol>
    </InfoCard>
  );
}
