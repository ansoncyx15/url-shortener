import { AtSignIcon } from "lucide-react";
import Input from "@/src/components/inputs/Input";

export default function EmailInput({ label = "Email", ...props }) {
  return <Input label={label} {...props} type="email" prefix={<AtSignIcon size={18} />} />;
}
