"use client";

import cn from "@/lib/cn";
import ErrorMessage from "@/src/components/ErrorMessage";

export default function Input({
  label = "",
  type = "text",
  className = "",
  prefix = null,
  suffix = null,
  error,
  ...props
}) {
  const hasError = !!error;

  return (
    <div data-slot="input-group" role="group">
      {label && <p className="truncate text-sm">{label}</p>}

      <div
        data-invalid={hasError}
        className={cn(
          "flex w-full min-w-0 appearance-none gap-1.5 rounded-md p-1.5 text-base",
          "shadow-(--input-shadow) outline-none focus-within:shadow-(--input-focus-shadow)",
          "data-[invalid=true]:text-input-error data-[invalid=true]:shadow-(--input-invalid-shadow) data-[invalid=true]:focus-within:shadow-(--input-invalid-shadow)",
          className,
        )}
      >
        {prefix && (
          <span className="flex w-fit flex-none items-center rounded-l-md border-r border-input bg-transparent pr-1.5 pl-1 text-gray-500 group-focus-within:border-input">
            {prefix}
          </span>
        )}

        <input
          type={type}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-500"
          {...props}
        />

        {suffix && (
          <span className="flex w-fit flex-none items-center text-gray-500 group-focus-within:border-input">
            {suffix}
          </span>
        )}
      </div>

      <ErrorMessage error={error} />
    </div>
  );
}
