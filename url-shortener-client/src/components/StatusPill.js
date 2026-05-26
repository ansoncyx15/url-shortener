import { toLower } from "lodash";
import cn from "@/lib/cn";

const styles = {
  active: { dot: "bg-green-600", pill: "bg-green-50 text-green-900" },
  expired: { dot: "bg-red-500", pill: "bg-red-50 text-red-700" },
};

export default function StatusPill({ status = "active", className }) {
  const lowerCaseStatus = toLower(status);
  const style = styles[lowerCaseStatus] ?? styles.active;
  const label = lowerCaseStatus[0].toUpperCase() + lowerCaseStatus.slice(1);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        style.pill,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {label}
    </div>
  );
}
