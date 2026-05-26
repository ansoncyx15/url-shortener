"use client";

import { isEmpty } from "lodash";
import Link from "next/link";
import ShortenUrlItem from "@/app/my-links/_ui/ShortenUrlItem";
import useSession from "@/hooks/useSession";
import useUrls from "@/hooks/useUrls";
import cn from "@/lib/cn";
import HelpText from "@/src/components/HelpText";

export default function Recent5ShortenUrls() {
  const { isAuthed } = useSession();
  const { urls, loading } = useUrls({ perPage: 5 });
  const recent5Urls = urls.slice(0, 5);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="flex flex-1 items-center text-center text-muted-foreground before:flex-1 before:border-b after:flex-1 after:border-b">
          <span className="px-2 text-base uppercase">{`Recent 5 links`}</span>
        </h1>

        <Link
          href="my-links"
          className={cn(
            "shrink-0 cursor-pointer text-xs text-muted-foreground underline active:opacity-80",
            { hidden: !isAuthed },
          )}
        >
          Show more
        </Link>
      </div>

      <HelpText
        className={isAuthed ? "hidden" : ""}
        text="Login to view more short links created. As a guest, you can only view recent 5 links."
      />

      <div className="divide-y divide-[#e6e2d4] rounded-xl border border-[#e6e2d4] bg-white ">
        <Items loading={loading} urlsHistory={recent5Urls} />
      </div>
    </div>
  );
}

const Items = ({ loading, urlsHistory }) => {
  if (loading) {
    return <p className="p-4 text-sm text-muted-foreground">Loading…</p>;
  }

  if (isEmpty(urlsHistory)) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        No links yet. Shorten one above to get started.
      </p>
    );
  }

  return urlsHistory.map((url) => <ShortenUrlItem simple key={url.id} url={url} />);
};
