"use client";

import { cva } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import cn from "@/lib/cn";

const variants = cva(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-1.5 text-base font-normal whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-button hover:bg-primary-hover active:bg-primary-active",
        success:
          "bg-success text-success-foreground shadow-button transition delay-30 duration-300 ease-in-out hover:scale-110 hover:bg-success-hover active:bg-success-active",
        ghost: "bg-transparent hover:bg-ghost-hover active:bg-ghost-active",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  },
);

export default function Button({
  type = "button",
  variant,
  className,
  disabled = false,
  loading = false,
  onClick,
  children,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      aria-disabled={isDisabled}
      aria-busy={loading}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      className={cn(
        variants({ variant }),
        "aria-disabled:cursor-not-allowed aria-disabled:opacity-65",
        "aria-disabled:hover:translate-y-0 aria-disabled:hover:scale-100",
        className,
      )}
      {...props}
    >
      {loading && <Loader2Icon size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
