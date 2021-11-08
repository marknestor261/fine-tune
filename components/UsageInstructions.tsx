import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UsageInstructions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <details className="mt-12 bg-white group prose">
      <summary className="font-bold text-lg flex gap-2 items-center">
        <FontAwesomeIcon icon={faChevronDown} className="group-open:hidden" />
        <FontAwesomeIcon
          icon={faChevronUp}
          className="hidden group-open:inline"
        />
        Usage Instructions
      </summary>
      {children}
    </details>
  );
}
