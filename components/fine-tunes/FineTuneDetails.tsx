import DetailsPage from "components/DetailsPage";
import React from "react";
import useSWRImmutable from "swr/immutable";
import type { OpenAI } from "types/openai";
import FineTuneForm from "./FineTuneForm";
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
