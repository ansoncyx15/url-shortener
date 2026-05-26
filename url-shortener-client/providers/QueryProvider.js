"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SESSION_EVENT } from "@/lib/auth";

export default function QueryProvider({ children }) {
  // Lazy initializer: create the client once for the component's lifetime, not a
  // new one (and a wiped cache) on every render.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute before refetching
            retry: 1,
          },
        },
      }),
  );

  // On login/logout, drop the previous identity's cached links prevent data leakage.
  useEffect(() => {
    const onSession = () => queryClient.removeQueries({ queryKey: ["urls"] });
    window.addEventListener(SESSION_EVENT, onSession);
    return () => window.removeEventListener(SESSION_EVENT, onSession);
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
