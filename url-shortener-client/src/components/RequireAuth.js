"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSession from "@/hooks/useSession";

// Redirect guest to the main page, since this page only for logged in user
export default function RequireAuth({ children }) {
  const router = useRouter();
  const { isAuthed, ready } = useSession();

  useEffect(() => {
    if (ready && !isAuthed) router.replace("/");
  }, [ready, isAuthed, router]);

  if (!ready || !isAuthed) return null;

  return children;
}
