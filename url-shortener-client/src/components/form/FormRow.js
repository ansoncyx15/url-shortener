"use client";

import { Children } from "react";
import cn from "@/lib/cn";

export default function FormRow({ children, className, ...props }) {
  const cols = Children.toArray(children);
  const colsCount = props.colsCount || Children.count(cols);
  if (colsCount === 0) return null;

  const classNames = cn("form-row grid w-full grid-cols-1 items-start gap-4", className);

  return (
    <div className={classNames} data-cols={colsCount}>
      {children}
    </div>
  );
}
