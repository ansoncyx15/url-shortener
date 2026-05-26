import { clearSession, clearGuestToken, getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors; // full_messages array from Rails, when present
  }
}

export async function apiFetch(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // A 401 while a user session is stored means that token is no longer valid
    // (e.g. the 7-day session expired server-side). Drop the stale session so the
    // UI stops showing the user as logged in. Guarded on getToken() so a failed
    // login or a guest request doesn't trigger it.
    if (res.status === 401) {
      if (getToken()) clearSession();
      else clearGuestToken();
    }

    const message = data.error || data.errors?.[0] || `Request failed (${res.status})`;
    throw new ApiError(message, { status: res.status, errors: data.errors });
  }

  return data;
}
