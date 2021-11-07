import useAuthentication from "components/account/useAuthentication";
import { MetadataCard } from "components/MetadataCard";
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
    <MetadataCard
      fields={[
        { label: "ID", value: fineTune.id, clickToCopy: true },
        { label: "Engine", value: fineTune.model },
        {
          label: "Training",
          value: fineTune.training_files
            .map(({ filename }) => filename)
            .join(" "),
        },
        {
          label: "Validation",
          value: fineTune.validation_files
            .map(({ filename }) => filename)
            .join(" "),
        },
        { label: "Updated", value: new Date(fineTune.updated_at * 1000) },
      ]}
    />
    /*
            {resultFile && (
              <tr>
                <th>Result Files</th>
                <td>
                  <Button
                    flat
                    icon={<FontAwesomeIcon icon={faDownload} />}
                    size="small"
                    onClick={(event) => {
                      event.preventDefault();
                      download(resultFile);
                    }}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Collapse>
    </Collapse.Group>
  */
  );
}
