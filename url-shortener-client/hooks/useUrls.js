"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useSession from "@/hooks/useSession";
import { apiFetch } from "@/lib/api";
import { ensureSessionToken } from "@/lib/auth";

// Fetch one page of the current identity's links. Ensures a session token first
// so a fresh guest gets one before listing, instead of hitting a 401.
// Returns { data, pagination }.
export async function listUrls({ page = 1, perPage = 10, query = "" } = {}) {
  const token = await ensureSessionToken();
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (query) params.set("q", query);

  return apiFetch(`/api/urls?${params.toString()}`, { token });
}

export default function useUrls({ page = 1, perPage = 10, query = "" } = {}) {
  const { token } = useSession();
  const identity = token ?? "guest"; // separate cache bucket per identity

  const { data, isPending, error } = useQuery({
    queryKey: ["urls", identity, { page, perPage, query }], // cache + invalidation key
    queryFn: () => listUrls({ page, perPage, query }),
    placeholderData: keepPreviousData, // keep the old page visible while the next loads
  });

  return {
    urls: data?.data ?? [],
    pagination: data?.pagination ?? null,
    loading: isPending,
    error,
  };
}
