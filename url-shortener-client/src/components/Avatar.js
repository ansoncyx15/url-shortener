import { isEmpty, words } from "lodash";
import { UserIcon } from "lucide-react";
import useSession from "@/hooks/useSession";
import cn from "@/lib/cn";

const getInitials = (name) => {
  const parts = words(name);

  if (isEmpty(parts)) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Avatar({ className }) {
  const { username } = useSession();

  const initials = getInitials(username);

  return (
    <div
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6e2d4] align-middle select-none",
        className,
      )}
    >
      {isEmpty(initials) ? <UserIcon size="18" /> : initials}
    </div>
  );
}
