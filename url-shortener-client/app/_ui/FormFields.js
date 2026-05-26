import { LinkIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import Input from "@/src/components/inputs/Input";
import Select from "@/src/components/Select";

// Accept only well-formed http(s) URLs, matching the backend's validation.
function isHttpUrl(value) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

function LongUrlInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      label="Long url"
      placeholder="https://example.com.sg/paste-the-long-url-here"
      prefix={<LinkIcon size="18" />}
      {...register("longUrl", {
        required: "Long url is required!",
        maxLength: { value: 3000, message: "Maximum 3000 characters allowed!" },
        validate: (value) =>
          isHttpUrl(value) || "Enter a valid URL starting with http:// or https://",
      })}
      error={errors?.longUrl?.message}
    />
  );
}

function CustomAliasInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      label={
        <>
          Custom alias <span className="text-sm font-normal text-muted-foreground">(optional)</span>
        </>
      }
      placeholder="custom"
      prefix="localhost/ "
      {...register("customAlias", {
        maxLength: { value: 15, message: "Maximum 15 characters allowed!" },
      })}
      error={errors?.customAlias?.message}
    />
  );
}

function ExpirySelect() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Select label="Expiry" {...register("expiresIn")} error={errors?.expiresIn?.message}>
      <option value="60">1 min (Test purpose)</option>
      <option value="3600">1 hour</option>
      <option value="86400">1 day</option>
      <option value="604800">7 days</option>
      <option value="2592000">1 month</option>
      <option value="">Never</option>
    </Select>
  );
}

export { LongUrlInput, CustomAliasInput, ExpirySelect };
