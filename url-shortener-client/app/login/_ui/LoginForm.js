"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { EmailInputField, PasswordInputField } from "@/app/sign-up/_ui/SignUpFormFields";
import { ApiError } from "@/lib/api";
import { saveSession, login } from "@/lib/auth";
import Button from "@/src/components/Button";
import ErrorMessage from "@/src/components/ErrorMessage";
import Form from "@/src/components/form/Form";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm({ defaultValues: { email: "", password: "" } });
  const {
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async ({ email, password }) => {
    try {
      const session = await login({ email, password });
      saveSession(session);
      router.push("/");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-2">
      <div className="space-y-2">
        <EmailInputField />
        <PasswordInputField />
      </div>

      <ErrorMessage error={errors?.root?.message} />

      <div className="flex flex-col items-center gap-3">
        <Button variant="primary" type="submit" className="w-1/2" loading={isSubmitting}>
          Log in
        </Button>

        <Link href="sign-up" className="text-sm text-muted-foreground">
          Do not have an account? <span className="pl-1 text-blue-500">Register</span>
        </Link>
      </div>
    </Form>
  );
}
