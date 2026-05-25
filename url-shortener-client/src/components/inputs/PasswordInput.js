"use client";

import { EyeIcon, EyeOffIcon, KeyRoundIcon } from "lucide-react";
import { useState } from "react";
import Input from "@/src/components/inputs/Input";

export default function PasswordInput({ label = "Password", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      label={label}
      {...props}
      type={visible ? "text" : "password"}
      prefix={<KeyRoundIcon size="18" />}
      suffix={
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((prev) => !prev)}
          className="flex cursor-pointer items-center outline-none hover:text-gray-700"
        >
          {visible ? <EyeOffIcon size="18" /> : <EyeIcon size="18" />}
        </button>
      }
    />
  );
}
