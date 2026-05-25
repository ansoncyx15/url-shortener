"use client";

import { FormProvider } from "react-hook-form";
import cn from "@/lib/cn";

export default function Form({ form, onSubmit, onError, className, children }) {
  const classNames = cn("", className);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={classNames}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            e.preventDefault();
          }
        }}
      >
        {children}
      </form>
    </FormProvider>
  );
}
