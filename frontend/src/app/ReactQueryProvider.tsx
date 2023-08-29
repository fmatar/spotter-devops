"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient, setQueryClient] = useState(new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
