import Link from "next/link";
import { usePathname } from "next/navigation";
import useSession from "@/hooks/useSession";
import { Tabs, TabsList, TabsTab } from "@/src/components/Tabs";

export default function LinkTabs() {
  const pathname = usePathname();
  const { isAuthed } = useSession();

  if (!isAuthed) return null;

  return (
    <Tabs value={pathname}>
      <TabsList>
        <TabsTab nativeButton={false} value="/" render={<Link href="/" />}>
          Shorten
        </TabsTab>
        <TabsTab nativeButton={false} value="/my-links" render={<Link href="/my-links" />}>
          My links
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
