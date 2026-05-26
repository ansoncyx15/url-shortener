import { LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSession from "@/hooks/useSession";
import Avatar from "@/src/components/Avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "@/src/components/Menu";

export default function AvatarMenu() {
  return (
    <Menu>
      <MenuTrigger>
        <Avatar />
      </MenuTrigger>

      <MenuContent>
        <MenuItems />
      </MenuContent>
    </Menu>
  );
}

const MenuItems = () => {
  const router = useRouter();
  const { isAuthed, username, email, signOut } = useSession();

  const handleSignOut = () => {
    signOut();
    router.push("/");
    router.refresh();
  };

  if (!isAuthed) {
    return (
      <MenuItem render={<Link href="/login" />}>
        <div className="flex cursor-pointer items-center gap-2">
          <LogInIcon size="18" />
          Log in
        </div>
      </MenuItem>
    );
  }

  return (
    <>
      <MenuLabel>
        <div className="space-y-2">
          <div className="flex items-center-safe gap-2">
            <Avatar className="size-8" />
            <p className="text-sm text-gray-600">Signed in as {username}</p>
          </div>

          <p>{email}</p>
        </div>
      </MenuLabel>

      <MenuSeparator />

      <MenuItem onClick={handleSignOut}>
        <div className="flex cursor-pointer items-center gap-2">
          <LogOutIcon size="18" />
          Sign out
        </div>
      </MenuItem>
    </>
  );
};
