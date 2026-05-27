import { isEmpty } from "lodash";
import { CircleCheckIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import Link from "next/link";
import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import HelpText from "@/src/components/HelpText";

export default function ShortenUrlCreatedView({ url, setCreatedUrl = () => {} }) {
  if (isEmpty(url)) return null;

  const { shortUrl, longUrl, expiresAt } = url;
  const expiredLabel = expiresAt ? new Date(expiresAt).toLocaleDateString() : "";

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-1 text-green-500">
        <CircleCheckIcon size={18} /> Your tiny url is ready!
      </div>

      <div>
        <Link
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center-safe gap-2 py-0.5"
        >
          <h1 className="truncate text-xl">{shortUrl}</h1>
          <div className="my-auto rounded-md border border-gray-400 p-1 drop-shadow-md">
            <SquareArrowOutUpRightIcon size="14" />
          </div>
        </Link>
        <div className="truncate text-muted-foreground">redirects to {longUrl}</div>
      </div>

      <div className="w-full sm:flex sm:items-center-safe sm:justify-between sm:space-y-1">
        <HelpText
          icon={false}
          text={expiredLabel ? `Expires at ${expiredLabel}` : "No expiration"}
          className="pb-1 sm:mt-auto sm:pb-0"
        />

        <Button variant="primary" className="w-full sm:w-auto" onClick={() => setCreatedUrl(null)}>
          Shorten another
        </Button>
      </div>
    </Card>
  );
}
