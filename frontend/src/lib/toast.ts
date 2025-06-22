import { UseToastOptions } from "@chakra-ui/react";

const defaultToastOptions: Partial<UseToastOptions> = {
  duration: 2000,
  isClosable: true,
  colorScheme: "brand.accent",
};

export const toastConfig = {
  success: (
    title: string,
    options?: Partial<UseToastOptions>
  ): UseToastOptions => ({
    ...defaultToastOptions,
    title,
    status: "success",
    ...options,
  }),

  error: (
    title: string,
    options?: Partial<UseToastOptions>
  ): UseToastOptions => ({
    ...defaultToastOptions,
    title,
    status: "error",
    duration: 3000,
    ...options,
  }),

  info: (
    title: string,
    options?: Partial<UseToastOptions>
  ): UseToastOptions => ({
    ...defaultToastOptions,
    title,
    status: "info",
    ...options,
  }),

  warning: (
    title: string,
    options?: Partial<UseToastOptions>
  ): UseToastOptions => ({
    ...defaultToastOptions,
    title,
    status: "warning",
    ...options,
  }),
};
