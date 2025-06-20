"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { theme } from "@/theme";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {/* on every app load, the user info is loaded into 
          the Zustand store before any child components render */}
          {children}
        </QueryClientProvider>
      </ChakraProvider>
    </GoogleOAuthProvider>
  );
}
