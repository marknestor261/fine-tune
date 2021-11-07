import { Button } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import ErrorMessage from "components/ErrorMessage";
import Loading from "components/Loading";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import type { OpenAI } from "types/openai";

export default function FineTuneList() {
  const { data, error } = useSWR<OpenAI.List<OpenAI.FineTune>>("fine-tunes");

  if (error) return <ErrorMessage error={error} />;
  if (!data) return <Loading />;
  const fineTunes = data.data;

  if (fineTunes.length === 0) {
    return (
      <div className="my-4">
        <b>No fine-tuned models</b>
      </div>
    );
  }

  return (
    <>
      <Processing fineTunes={fineTunes} />
      <FineTunesTable fineTunes={fineTunes} />
    </>
  );
}

function Processing({ fineTunes }: { fineTunes: OpenAI.FineTune[] }) {
  const processing = fineTunes.filter(
    (fineTune) => fineTune.status !== "succeeded"
  );

  useEffect(
    function () {
      if (processing.length === 0) return;

      const interval = setInterval(() => {
        mutate("fine-tunes");
      }, 1000);
      return () => clearInterval(interval);
    },
    [processing]
  );

  return (
    <ol className="my-4 list-none m-0">
      {processing.map((fineTune) => (
        <li key={fineTune.id}>
          Processing {fineTune.id} <CancelFineTune id={fineTune.id} />
        </li>
      ))}
    </ol>
  );
}

function FineTunesTable({ fineTunes }: { fineTunes: OpenAI.FineTune[] }) {
  const router = useRouter();
  const ready = fineTunes.filter((fineTune) => fineTune.status === "succeeded");
  return (
    <table cellPadding={10} className="my-4 w-full">
      <tbody>
        {ready
          .sort((a, b) => b.updated_at - a.updated_at)
          .map((fineTune, index) => (
            <tr
              className={index % 2 === 0 ? "bg-gray-100" : ""}
              key={fineTune.id}
            >
              <td className="align-text-top">
                <Button
                  light
                  color="primary"
                  onClick={() => router.push(`/fine-tunes/${fineTune.id}`)}
                >
                  {fineTune.id}
                </Button>
              </td>
              <td className="truncate max-w-xs">
                {[...fineTune.training_files, ...fineTune.validation_files]
                  .map(({ filename }) => filename)
                  .join(", ")}
              </td>
              <td className="align-text-top whitespace-nowrap">
                {new Date(fineTune.updated_at * 1000).toLocaleString()}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function CancelFineTune({ id }: { id: string }) {
  const { headers } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);

  async function onClick() {
    try {
      setIsLoading(true);
      await fetch(`https://api.openai.com/v1/fine-tunes/${id}/cancel`, {
        method: "PSOT",
        headers,
      });
      await mutate("tune-tunes");
    } catch (error) {
      toast.error(String(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      auto
      color="error"
      size="mini"
      flat
      loading={isLoading}
      onClick={onClick}
    >
      Cancel
    </Button>
  );
}
