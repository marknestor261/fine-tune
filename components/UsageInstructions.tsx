import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UsageInstructions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <details className="prose mt-12 bg-white group">
      <summary className="font-bold text-lg items-center flex justify-between">
        Usage Instructions
        <FontAwesomeIcon icon={faChevronDown} className="group-open:hidden" />
        <FontAwesomeIcon
          icon={faChevronUp}
          className="hidden group-open:inline"
        />
      </summary>
      {children}
    </details>
  );
}
