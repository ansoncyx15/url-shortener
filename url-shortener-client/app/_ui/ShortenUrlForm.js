"use client";

import { isEmpty } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomAliasInput, ExpirySelect, LongUrlInput } from "@/app/_ui/FormFields";
import ShortenUrlCreatedView from "@/app/_ui/ShortenUrlCreatedView";
import useShortenUrl from "@/hooks/useShortenUrl";
import { ApiError } from "@/lib/api";
import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import ErrorMessage from "@/src/components/ErrorMessage";
import Form from "@/src/components/form/Form";
import FormRow from "@/src/components/form/FormRow";

export default function ShortenUrlForm() {
  const shortenUrl = useShortenUrl();
  const [createdUrl, setCreatedUrl] = useState(null);

  const form = useForm({
    defaultValues: {
      longUrl: "",
      customAlias: "",
      expiresIn: "86400",
    },
  });
  const {
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (input) => {
    clearErrors("root");
    setCreatedUrl(null);

    const { longUrl, customAlias, expiresIn } = input;

    try {
      const url = await shortenUrl.mutateAsync({
        longUrl,
        customAlias,
        expiresInSeconds: expiresIn ? Number(expiresIn) : undefined,
      });
      setCreatedUrl(url);
      reset();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  };

  if (!isEmpty(createdUrl)) {
    return <ShortenUrlCreatedView url={createdUrl} setCreatedUrl={setCreatedUrl} />;
  }

  return (
    <Card>
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <FormRow>
          <LongUrlInput />
        </FormRow>

        <FormRow>
          <CustomAliasInput />
          <ExpirySelect />
        </FormRow>

        <ErrorMessage error={errors?.root?.message} />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => reset()}>
            Clear
          </Button>
          <Button variant="success" type="submit" loading={isSubmitting}>
            Shorten
          </Button>
        </div>
      </Form>
    </Card>
  );
}
