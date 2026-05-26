"use client";

import { useSyncExternalStore } from "react";
import { clearSession, getEmail, getToken, SESSION_EVENT } from "@/lib/auth";

// Module scope on purpose: useSyncExternalStore needs a STABLE subscribe — if it's
// recreated each render, React re-subscribes (re-adds the listeners) every render.
function subscribe(callback) {
  window.addEventListener(SESSION_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function usernameFromEmail(email) {
  return email ? email.split("@")[0] : "";
}

export default function useSession() {
  // undefined = not read yet (server / first paint); null = read, logged out.
  const token = useSyncExternalStore(subscribe, getToken, () => undefined);
  const email = useSyncExternalStore(subscribe, getEmail, () => undefined);
  const ready = token !== undefined;

  const signOut = clearSession;

  if (!ready) {
    return { token: null, email: null, username: "", isAuthed: false, ready, signOut };
  }

  return {
    token,
    email,
    username: usernameFromEmail(email),
    isAuthed: !!token,
    ready,
    signOut,
  };
}
