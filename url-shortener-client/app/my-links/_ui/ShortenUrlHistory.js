"use client";

import { isEmpty } from "lodash";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import ShortenUrlItem from "@/app/my-links/_ui/ShortenUrlItem";
import useUrls from "@/hooks/useUrls";
import Input from "@/src/components/inputs/Input";
import Pagination from "@/src/components/Pagination";

export default function ShortenUrlHistory() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const PER_PAGE = 10;

  const { urls, pagination, loading } = useUrls({ page, perPage: PER_PAGE, query });

  const onSubmit = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q") ?? "";
    setQuery(q.trim());
    setPage(1);
  };

  const total = pagination?.total ?? 0;
  const totalPages = pagination?.total_pages ?? 0;

  return (
    <div className="space-y-3">
      <div data-cols="2" className="form-row grid w-full grid-cols-1 items-start gap-4">
        <form onSubmit={onSubmit}>
          <Input
            name="q"
            defaultValue={query}
            prefix={<SearchIcon size="18" />}
            placeholder="Search by alias or long url, then press Enter"
            className="sm:w-1/2s w-full bg-white"
          />
        </form>

        <div className="flex items-center gap-4 sm:justify-end">
          <p className="block text-sm text-muted-foreground">Total {total}</p>

          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
        </div>
      </div>

      <div className="divide-y divide-[#e6e2d4] overflow-hidden overflow-x-scroll overflow-y-scroll rounded-lg bg-white">
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading…</p>
        ) : isEmpty(urls) ? (
          <p className="p-4 text-sm text-muted-foreground">
            {query ? `No links match "${query}".` : "No links yet."}
          </p>
        ) : (
          urls.map((url) => <ShortenUrlItem key={url.id} url={url} />)
        )}
      </div>
    </div>
  );
}
