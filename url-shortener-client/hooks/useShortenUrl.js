"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { ensureSessionToken, getToken, clearGuestToken, clearSession } from "@/lib/auth";

async function postShorten({ longUrl, customAlias, expiresInSeconds }) {
  // ensure having a token before posting, so a fresh guest gets one and avoids a 401
  const token = await ensureSessionToken();

  return apiFetch("/api/urls", {
    method: "POST",
    token,
    body: {
      long_url: longUrl,
      custom_alias: customAlias || undefined,
      expires_in: expiresInSeconds || undefined,
    },
  });
}

async function shortenUrl(args) {
  try {
    return await postShorten(args);
  } catch (err) {
    if (err?.status === 401) {
      // Whatever token we sent is dead server-side, I clear both and retry.
      if (getToken()) clearSession();
      else clearGuestToken(); // ensureSessionToken will mint a fresh one
      return await postShorten(args);
    }
    throw err;
  }
}

export default function useShortenUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shortenUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] }); // mark stale, and refetch the visible one if it's in the cache.
    },
  });
}
