import filesize from "filesize";
import React from "react";
import { OpenAI } from "types/openai";

export default function FileMetadata({ file }: { file: OpenAI.File }) {
  return (
    <table className="w-full text-left" cellPadding={4}>
      <tbody>
        <tr>
          <th className="w-0">ID</th>
          <td>{file.id}</td>
        </tr>
        <tr>
          <th>Filename</th>
          <td>{file.filename}</td>
        </tr>
        <tr>
          <th>Size</th>
          <td>{filesize(file.bytes)}</td>
        </tr>
        <tr>
          <th>Uploaded</th>
          <td>{new Date(file.created_at * 1000).toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  );
}
