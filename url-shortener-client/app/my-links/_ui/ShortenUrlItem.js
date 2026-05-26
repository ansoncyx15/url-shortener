import { LinkIcon, SquareArrowOutUpRightIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import cn from "@/lib/cn";
import StatusPill from "@/src/components/StatusPill";

export default function ShortenUrlItem({ url, simple = false }) {
  if (!url) return null;

  const { shortUrl, longUrl, isExpired, shortCode, visitCount, createdAt } = url;
  const createdLabel = createdAt ? new Date(createdAt).toLocaleDateString() : "";
  console.log(url);

  return (
    <div
      className={cn("min-w-lg p-4 first:rounded-t-xl last:rounded-b-xl hover:bg-[#fffced]", {
        "cursor-pointer transition delay-30 duration-300 ease-in-out hover:scale-x-101 hover:border  hover:border-[#e6e2d4] active:opacity-80":
          simple,
      })}
    >
      <div className="flex items-center-safe gap-6">
        <div className="hidden rounded-md border border-[#e6e2d4] bg-[#faf8f1] p-1.5 sm:inline">
          <LinkIcon size="18" color="#8a8780" />
        </div>

        <div className="min-w-0 flex-1 truncate text-ellipsis">
          <p className="hidden truncate sm:inline">{shortUrl}</p>
          <p className="inline truncate sm:hidden">{shortCode}</p>
          <p className="truncate text-sm text-muted-foreground">{longUrl}</p>
        </div>

        {!simple && <StatusPill status={isExpired ? "expired" : "active"} />}

        <p className="my-auto px-2 text-xs text-muted-foreground">{createdLabel}</p>

        <div>
          <p className="text-end text-sm font-semibold">{visitCount}</p>
          <p className="text-xs text-muted-foreground">clicks</p>
        </div>

        <Link
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="my-auto hidden rounded-md border border-[#e6e2d4] p-1.5 drop-shadow-md hover:bg-gray-50 active:bg-gray-100 sm:inline"
        >
          <SquareArrowOutUpRightIcon size="18" />
        </Link>

        {!simple && (
          <button
            className="my-auto hidden cursor-pointer rounded-md border border-red-200 p-1.5 text-red-500 drop-shadow-md hover:bg-red-50 active:bg-red-100"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Delete", url.id);
            }}
          >
            <Trash2Icon size="18" />
          </button>
        )}
      </div>
    </div>
  );
}
