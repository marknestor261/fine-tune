import { faFileUpload } from "@fortawesome/free-solid-svg-icons/faFileUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import parse from "csv-parse/lib/sync";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { OpenAI } from "types/openai";

export default function UploadFileButton({
  fields,
  purpose,
}: {
  fields: string[];
  purpose: OpenAI.Purpose;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { headers } = useAuthentication();

  async function onChange() {
    try {
      setIsLoading(true);
      const file = inputRef.current?.files?.[0];
      if (!file) return;

      const jsonl = await toJSONL(file, fields);
      const body = new FormData();
      body.append("purpose", purpose);
      body.append(
        "file",
        // eslint-disable-next-line sonarjs/no-duplicate-string
        new Blob([jsonl], { type: "application/json" }),
        file.name
      );

      const response = await fetch("https://api.openai.com/v1/files", {
        method: "POST",
        headers,
        body,
      });
      if (response.ok) {
        await mutate("files");
        toast.success("File uploaded successfully");
      } else {
        const { error } = (await response.json()) as OpenAI.ErrorResponse;
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(String(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <span>
      <input
        accept={["application/json", "text/csv"].join()}
        onChange={onChange}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />
      <Button
        flat
        icon={<FontAwesomeIcon icon={faFileUpload} />}
        loading={isLoading}
        onClick={() => inputRef.current?.click()}
        size="small"
      >
        Upload File
      </Button>
    </span>
  );
}

async function toJSONL(file: File, fields: string[]) {
  switch (file.type) {
    case "application/json": {
      let lines;
      try {
        const text = await file.text();
        lines = text.split("\n").map((line) => JSON.parse(line));
      } catch (error) {
        throw new Error("This is not a JSONL file");
      }
      validate(lines, fields);
      return lines.map((row) => JSON.stringify(row)).join("\n");
    }

    case "text/csv": {
      const text = await file.text();
      const csv = parse(text, { columns: true }) as { [key: string]: string }[];
      validate(csv, fields);
      return csv.map((row) => JSON.stringify(row)).join("\n");
    }

    default: {
      throw new Error(`Unsupported file type ${file.type}`);
    }
  }
}

function validate(records: Array<{ [key: string]: string }>, fields: string[]) {
  fields.forEach((field) => {
    const all = records.every((record) => record[field] !== undefined);
    if (!all)
      throw new Error(`Some or all records missing the field "${field}""`);
  });
}
