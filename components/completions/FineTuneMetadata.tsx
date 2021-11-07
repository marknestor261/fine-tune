import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@nextui-org/react";
import useAuthentication from "components/account/useAuthentication";
import { toast } from "react-toastify";
import { OpenAI } from "types/openai";

export default function FineTuneMetadata({
  fineTune,
}: {
  fineTune: OpenAI.FineTune;
}) {
  const { headers } = useAuthentication();
  const resultFile = fineTune.result_files[0];

  async function download(file: OpenAI.File) {
    const response = await fetch(
      `https://api.openai.com/v1/files/${file.id}/content`,
      { headers }
    );
    if (!response.ok) {
      toast.error(`Failed to download ${file.filename}`);
      return;
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.type = "text/csv";
    link.download = file.filename;
    link.click();
  }

  return (
    <table className="w-full text-left" cellPadding={4}>
      <tbody>
        <tr>
          <th>ID</th>
          <td>{fineTune.id}</td>
        </tr>
        <tr>
          <th>Engine</th>
          <td>{fineTune.model}</td>
        </tr>
        <tr>
          <th>Training Files</th>
          <td>
            {fineTune.training_files.map(({ filename }) => filename).join(" ")}
          </td>
        </tr>
        <tr>
          <th>Validation Files</th>
          <td>
            {fineTune.validation_files
              .map(({ filename }) => filename)
              .join(" ") || "None"}
          </td>
        </tr>
        <tr>
          <th>Updated</th>
          <td>{new Date(fineTune.updated_at * 1000).toLocaleString()}</td>
        </tr>
        {resultFile && (
          <tr>
            <th>Result Files</th>
            <td>
              <Link
                className="flex gap-2"
                color="primary"
                onClick={(event) => {
                  event.preventDefault();
                  download(resultFile);
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
                Download
              </Link>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
