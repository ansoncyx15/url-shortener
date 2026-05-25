"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import cn from "@/lib/cn";
import ErrorMessage from "@/src/components/ErrorMessage";

export default function Select({ label = "", className = "", error, children, ...props }) {
  const hasError = !!error;

  return (
    <div data-slot="select-group" role="group">
      {label && <p className="truncate text-sm">{label}</p>}

      <div
        data-invalid={hasError}
        className={cn(
          "flex w-full min-w-0 appearance-none gap-1.5 rounded-md p-1.5 text-base shadow-(--input-shadow) outline-none focus-within:shadow-(--input-focus-shadow)",
          "data-[invalid=true]:text-input-error data-[invalid=true]:shadow-(--input-invalid-shadow) data-[invalid=true]:focus-within:shadow-(--input-invalid-shadow)",
          className,
        )}
      >
        <select className={cn("w-full appearance-none outline-none", className)} {...props}>
          {children}
        </select>

        <span className="flex flex-none items-center text-gray-500 group-focus-within:border-input">
          <ChevronsUpDownIcon size="18" />
        </span>
      </div>

      <ErrorMessage error={error} />
    </div>
  );
}
