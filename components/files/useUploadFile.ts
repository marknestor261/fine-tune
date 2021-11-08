import useAuthentication from "components/account/useAuthentication";
import parse from "csv-parse/lib/sync";
import filesize from "filesize";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { OpenAI } from "types/openai";

const maxFileSize = 150 * 1024 * 1024;

export type Enforce = {
  // All these fields are required
  readonly required: string[];
  // These fields are optional
  readonly optional?: string[];
  // Count the tokens in these field
  readonly count: string[];
  // Maximum number of tokens
  readonly maxTokens: number;
};

export default function useUploadFile(purpose: string, enforce: Enforce) {
  const { headers } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);

  async function uploadFile(file: File) {
    try {
      setIsLoading(true);

      const records = await parseAndValidate(file, enforce);
      const largeRecords = await findLargeRecords(records, enforce);

      if (largeRecords.length > 0) {
        const confirmed = confirmLargeRecords(largeRecords, enforce.maxTokens);
        if (!confirmed) return;
      }

      const blob = new Blob([toJSONL(records)], { type: "application/json" });
      const body = new FormData();
      body.append("purpose", purpose);
      body.append("file", blob, file.name);

      const response = await fetch("https://api.openai.com/v1/files", {
        method: "POST",
        headers,
        body,
      });
      if (response.ok) {
        await mutate("files");
        toast.success(
          `Uploaded new ${purpose} file: ${records.length} records, ${filesize(
            blob.size
          )}`
        );
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

  return { uploadFile, isLoading };
}

async function parseAndValidate(
  file: File,
  enforce: Enforce
): Promise<Array<{ [key: string]: string }>> {
  const records = await parseFile(file);
  validateRecords(records, enforce);
  return records;
}

async function parseFile(
  file: File
): Promise<Array<{ [key: string]: string }>> {
  switch (file.type) {
    case "application/json": {
      try {
        const text = await file.text();
        const lines = text.split("\n");
        return lines.map((line) => JSON.parse(line));
      } catch (error) {
        throw new Error("This is not a JSONL file");
      }
    }

    case "text/csv": {
      const text = await file.text();
      return parse(text, { columns: true }) as { [key: string]: string }[];
    }

    default: {
      throw new Error(`Unsupported file type ${file.type}`);
    }
  }
}

function validateRecords(
  records: Array<{ [key: string]: string }>,
  enforce: Enforce
) {
  if (records.length === 0) throw new Error("No records found");

  const allFields = new Set([...enforce.required, ...(enforce.optional ?? [])]);

  records.forEach((record) => {
    const hasRequired = enforce.required.every(
      (key) => typeof record[key] === "string"
    );
    if (!hasRequired)
      throw new Error(
        `Missing required field(s). Expecting: ${enforce.required}`
      );

    const onlyAllowed = Object.keys(record).every((key) => allFields.has(key));
    if (!onlyAllowed)
      throw new Error(`Unknown field(s). Allowed: ${allFields}`);
  });
}

async function findLargeRecords(
  records: Array<{ [key: string]: string }>,
  enforce: Enforce
): Promise<Array<{ row: number; tokens: number }>> {
  const encode = import("lib/encoder").then((mod) => mod.default);

  const allRows = await Promise.all(
    records
      .map((record) => enforce.count.map((key) => record[key]).join(" "))
      .map(async (text, index) => ({
        row: index + 1,
        tokens: (await encode)(text).length,
      }))
  );
  return allRows.filter(({ tokens }) => tokens > enforce.maxTokens);
}

function confirmLargeRecords(
  largeRecords: Array<{ row: number }>,
  maxTokens: number
) {
  const rows = largeRecords.map(({ row }) => row).slice(0, 10);
  const message = [
    `This file has ${largeRecords.length} records with more than ${maxTokens} tokens.`,
    `For examples, rows ${rows.join(", ")}.`,
    `These records will not be processed. Continue anyway?`,
  ].join("\n");

  return window.confirm(message);
}

function toJSONL(records: Array<{ [key: string]: string }>): string {
  const jsonl = records.map((record) => JSON.stringify(record)).join("\n");
  if (jsonl.length > maxFileSize)
    throw new Error(`File too large (max ${filesize(maxFileSize)})`);
  return jsonl;
}
