import useAuthentication from "components/account/useAuthentication";
import ErrorMessage from "components/ErrorMessage";
import Loading from "components/Loading";
import parse from "csv-parse/lib/sync";
import React from "react";
import useSWRImmutable from "swr/immutable";

type ResultFileRecord = {
  elapsed_examples: number;
  elapsed_tokens: number;
  step: string;
  training_loss: number;
  training_sequence_accuracy: number;
  training_token_accuracy: number;
};

export default function FineTuneResultFile({ id }: { id: string }) {
  const { headers } = useAuthentication();

  const { data: results, error } = useSWRImmutable(
    `files/${id}/content`,
    async (resource) => {
      const response = await fetch(`https://api.openai.com/v1/${resource}`, {
        headers,
      });
      if (!response.ok) throw new Error(response.statusText);
      const raw = await response.text();
      return parse(raw, {
        cast: true,
        columns: true,
        skip_empty_lines: true,
      }) as ResultFileRecord[];
    }
  );

  if (error) return <ErrorMessage error={error} />;
  if (!results) return <Loading />;

  return (
    <table className="w-full text-left" cellPadding={4}>
      <thead>
        <th>Step</th>
        <th>Elapsed Tokens</th>
        <th>Examples</th>
        <th>Training Loss</th>
        <th>Sequency Accuracy</th>
        <th>Token Accuracy</th>
      </thead>
      <tbody>
        {results.map((row) => (
          <tr key={row.step}>
            <td>{row.step}</td>
            <td>{row.elapsed_tokens}</td>
            <td>{row.elapsed_examples}</td>
            <td>{row.training_loss}</td>
            <td>{row.training_sequence_accuracy}</td>
            <td>{row.training_token_accuracy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
