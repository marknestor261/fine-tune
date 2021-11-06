import { Button } from "@nextui-org/react";
import ErrorMessage from "components/ErrorMessage";
import Loading from "components/Loading";
import React from "react";
import useSWR from "swr";
import type { OpenAI } from "types/openai";
import DeleteFileButton from "./DeleteFileButton";

export default function FileListTable({
  onClick,
  purpose,
}: {
  onClick?: (file: OpenAI.File) => void;
  purpose: OpenAI.Purpose;
}) {
  const { data, error } = useSWR<OpenAI.List<OpenAI.File>>("files");

  if (error) return <ErrorMessage error={error} />;
  if (!data) return <Loading />;
  const files = data.data.filter((file) => file.purpose === purpose);
  if (files.length === 0) {
    return (
      <div className="my-4">
        <b>No files uploaded</b>
      </div>
    );
  }

  return (
    <table cellPadding={10} className="my-4 w-full">
      <tbody>
        {files
          .sort((a, b) => b.created_at - a.created_at)
          .map((file, index) => (
            <tr className={index % 2 === 0 ? "bg-gray-100" : ""} key={file.id}>
              <td>
                {onClick ? (
                  <Button light color="primary" onClick={() => onClick(file)}>
                    {file.id}
                  </Button>
                ) : (
                  file.id
                )}
              </td>
              <td>{file.filename}</td>
              <td>{new Date(file.created_at * 1000).toLocaleString()}</td>
              <td>
                <DeleteFileButton id={file.id} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
