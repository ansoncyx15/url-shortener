"use client";

import { useEffect } from "react";
import { ensureSessionToken } from "@/lib/auth";

// This only runs once on app load, which I put it at the app layout page.
// Is to let the app know if no user login, default to guest token
// and to ensure the guest token is ready
export default function GuestBootstrap() {
  useEffect(() => {
    ensureSessionToken();
  }, []);

  return null;
}
