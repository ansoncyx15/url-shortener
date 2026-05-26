import { useFormContext } from "react-hook-form";
import EmailInput from "@/src/components/inputs/EmailInput";
import PasswordInput from "@/src/components/inputs/PasswordInput";

function EmailInputField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <EmailInput
      label="Email"
      {...register("email", {
        required: "Email is required",
        pattern: {
          value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
          message: "Enter a valid email",
        },
      })}
      error={errors?.email?.message}
    />
  );
}

function PasswordInputField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <PasswordInput
      label="Password"
      {...register("password", {
        required: "Password is required",
        minLength: { value: 6, message: "At least 6 characters" },
      })}
      error={errors?.password?.message}
    />
  );
}

export { EmailInputField, PasswordInputField };
