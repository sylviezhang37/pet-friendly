"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import UserInitializer from "@/components/UserInitializer";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        {/* on every app load, the user info is loaded into 
        the Zustand store before any child components render */}
        <UserInitializer />
        {children}
      </QueryClientProvider>
    </ChakraProvider>
  );
}
