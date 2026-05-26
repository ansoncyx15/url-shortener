"use client";

import { clamp, range, uniq } from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import cn from "@/lib/cn";

// pattern will like this < | 1 | … | 39 | 40 | 41 | … | 80 | >
function getPageItems(page, totalPages, siblingCount = 1) {
  const siblings = range(
    clamp(page - siblingCount, 1, totalPages),
    clamp(page + siblingCount, 1, totalPages) + 1,
  );
  const shown = uniq([1, ...siblings, totalPages]);

  return shown.flatMap((p, i) => {
    if (i === 0) return [p];
    const gap = p - shown[i - 1];
    if (gap === 1) return [p];
    if (gap === 2) return [shown[i - 1] + 1, p];
    return ["…", p];
  });
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const onItemClick = (p) => {
    if (p >= 1 && p <= totalPages && p !== page) onChange(p);
  };

  const pages = getPageItems(page, totalPages);

  const base =
    "flex size-8 items-center justify-center rounded-md bg-white border border-gray-300 text-sm";
  const enabled = "cursor-pointer hover:opacity-70 active:opacity-90";
  const disabled = "cursor-not-allowed opacity-50";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-start gap-1">
      <button
        type="button"
        onClick={() => onItemClick(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(base, page <= 1 ? disabled : enabled)}
      >
        <ChevronLeftIcon size={16} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`dots-${i}`}
            aria-hidden="true"
            className="flex size-8 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onItemClick(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(base, enabled, {
              "border-gray-400 font-semibold": p === page,
            })}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onItemClick(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(base, page >= totalPages ? disabled : enabled)}
      >
        <ChevronRightIcon size={16} />
      </button>
    </nav>
  );
}
