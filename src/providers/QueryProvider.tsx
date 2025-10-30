import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

// Create a single QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Default for 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours in cache
      refetchOnWindowFocus: false, // can sometimes cause unexpected reloads when switching apps if set to true
      refetchOnReconnect: true,
      retry: 1, // Default retry attempts
    },
  },
});

export default function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
