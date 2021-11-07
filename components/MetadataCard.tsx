import { Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

export function MetadataCard({
  fields,
}: {
  fields: Array<{ label: string; value: string | number | Date }>;
}) {
  return (
    <table className="text-left min-w-min" cellPadding={4}>
      <tbody>
        {fields
          .map(({ label, value }) => ({
            label,
            value:
              value instanceof Date
                ? value.toLocaleDateString()
                : String(value),
          }))
          .map(({ label, value }) => (
            <tr key={label} className="flex">
              <th className="w-24 block truncate">{label}</th>
              <td className="w-60 block truncate">
                <ClickToCopy value={value}>{value}</ClickToCopy>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function ClickToCopy({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  return (
    <Tooltip
      content={copied ? "Copied!" : "Click to copy"}
      onVisibleChange={(visible) => visible && setCopied(false)}
      placement="left"
    >
      <span
        onClick={async () => {
          await copy(value);
          setCopied(true);
        }}
      >
        {children}
      </span>
    </Tooltip>
  );
}
