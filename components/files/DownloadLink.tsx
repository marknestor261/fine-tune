import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function DownloadLink({
  id,
  filename,
}: {
  id: string;
  filename: string;
}) {
  const { headers } = useAuthentication();
  const [isDownloading, setIsDownloading] = useState(false);

  async function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      setIsDownloading(true);
      const response = await fetch(
        `https://api.openai.com/v1/files/${id}/content`,
        { headers }
      );
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      toast.error(String(error));
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button auto loading={isDownloading} flat size="small" onClick={onClick}>
      <FontAwesomeIcon icon={faDownload} />
    </Button>
  );
}
