import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Textarea } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import ErrorMessage from "components/ErrorMessage";
import { useState } from "react";
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
    <main className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl">
        <span className="font-normal">Fine Tune Model</span> {id}
      </h1>
      {error && <ErrorMessage error={error} />}
      {fineTune && <FineTuneForm fineTune={fineTune} />}
      {fineTune && <FineTuneMetadata fineTune={fineTune} />}
      {fineTune && <FineTuneResultFile fineTune={fineTune} />}
    </main>
  );
}

function FineTuneForm({ fineTune }: { fineTune: OpenAI.FineTune }) {
  const form = useForm({ defaultValues: { prompt: "" } });
  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Completions.Response>();

  const onSubmit = form.handleSubmit(async ({ prompt }) => {
    const request: OpenAI.Completions.Request = {
      model: fineTune?.fine_tuned_model,
      prompt,
      n: 3,
      temperature: 0.8,
      max_tokens: 30,
    };
    const response = await fetch(`https://api.openai.com/v1/completions`, {
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
      {results && <CompletionResults results={results} />}
    </form>
  );
}

function CompletionResults({
  results,
}: {
  results: OpenAI.Completions.Response;
}) {
  return (
    <div>
      <h4 className="my-2">⭐️ Completions</h4>
      <ol>
        {results.choices.map((choice, index) => (
          <li key={index} className="truncate-4-lines">
            {choice.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
