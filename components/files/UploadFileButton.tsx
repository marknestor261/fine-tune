import { faFileUpload } from "@fortawesome/free-solid-svg-icons/faFileUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { OpenAI } from "types/openai";

export default function UploadFileButton({
  purpose,
}: {
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

      const body = new FormData();
      body.append("purpose", purpose);
      body.append("file", file);
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
        accept="application/json"
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
