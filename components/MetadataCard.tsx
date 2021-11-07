import { faCopy } from "@fortawesome/free-solid-svg-icons/faCopy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

export function MetadataCard({
  fields,
}: {
  fields: Array<{
    label: string;
    value: string | number | Date;
    clickToCopy?: boolean;
  }>;
}) {
  return (
    <div className="border rounded-xl shadow-xl max-w-md p-4 space-y-1">
      {fields
        .map(({ clickToCopy, label, value }) => ({
          clickToCopy,
          label,
          value: value instanceof Date ? value.toLocaleString() : String(value),
        }))
        .map(({ clickToCopy, label, value }) => (
          <div key={label} className="flex flex-nowrap gap-4">
            <span className="w-20 flex-shrink-0 font-bold"> {label}</span>
            {clickToCopy ? (
              <ClickToCopy className="flex gap-2 items-center" value={value}>
                <FontAwesomeIcon icon={faCopy} /> {value}
              </ClickToCopy>
            ) : (
              <span>{value}</span>
            )}
          </div>
        ))}
    </div>
  );
}

function ClickToCopy({
  children,
  className,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  return (
    <Tooltip
      className={className}
      content={copied ? "Copied!" : "Click to copy"}
      onVisibleChange={(visible) => visible && setCopied(false)}
      placement="left"
      onClick={async () => {
        await copy(value);
        setCopied(true);
      }}
    >
      {children}
    </Tooltip>
  );
}
