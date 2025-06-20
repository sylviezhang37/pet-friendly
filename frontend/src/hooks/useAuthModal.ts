import { useDisclosure, useToast } from "@chakra-ui/react";
import { useGoogleAuth } from "./useGoogleAuth";

export function useAuthModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { login, logout } = useGoogleAuth();
  const toast = useToast();

  const handleSignIn = () => {
    onClose();
    login();
    toast({
      title: "Signing in...",
      status: "info",
      duration: 2000,
      isClosable: true,
      colorScheme: "brand.primary",
    });
  };

  const handleSignOut = () => {
    onClose();
    logout();
    toast({
      title: "Signed out successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
      colorScheme: "brand.primary",
    });
  };

  return {
    isOpen,
    onOpen,
    onClose,
    handleSignIn,
    handleSignOut,
  };
}
