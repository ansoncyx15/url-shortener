import { isEmpty } from "lodash";
import { CircleAlertIcon } from "lucide-react";

export default function ErrorMessage({ error }) {
  if (isEmpty(error)) return null;

  return (
    <div role="alert" className="mt-1 flex gap-1 text-sm text-input-error">
      <span className="my-auto">
        <CircleAlertIcon size="14" />
      </span>
      {error}
    </div>
  );
}
