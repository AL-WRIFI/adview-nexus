
import React from 'react';
import { QueryClientProvider, QueryClient as TanstackQueryClient } from '@tanstack/react-query';

const queryClient = new TanstackQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface QueryClientProps {
  children: React.ReactNode;
}

export function QueryClient({ children }: QueryClientProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
