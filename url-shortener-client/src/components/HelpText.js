import { InfoIcon } from "lucide-react";
import cn from "@/lib/cn";

export default function HelpText({ icon = true, text, className }) {
  return (
    <div className={cn("flex flex-nowrap gap-1 text-sm text-muted-foreground", className)}>
      {icon && <InfoIcon className="my-auto" size="14" />}
      {text}
    </div>
  );
}
