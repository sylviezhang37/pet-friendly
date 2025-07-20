import { useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useGoogleAuth } from "./useGoogleAuth";
import { CredentialResponse } from "@react-oauth/google";
import { toastConfig } from "@/lib/toast";

export function useAuthModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleGoogleSignIn, completeSignIn, logout } = useGoogleAuth();
  const toast = useToast();

  // new user flow state
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState<{
    email: string;
    googleId: string;
  } | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = () => {
    onClose();
    toast(toastConfig.info("Signing in..."));
  };

  const handleSignOut = () => {
    onClose();
    logout();
    toast(toastConfig.success("Signed out successfully"));
  };

  const handleGoogleSignInWithFlow = async (
    credentialResponse: CredentialResponse
  ) => {
    setIsSigningIn(true);
    try {
      const signInResponse = await handleGoogleSignIn(credentialResponse);

      if (signInResponse && signInResponse.isNewUser) {
        const googleUser = signInResponse.user;
        setNewUserData({
          email: googleUser.email,
          googleId: googleUser.sub,
        });
        setIsNewUser(true);
        onClose();
      } else {
        onClose();
        toast(toastConfig.success("Signed in successfully"));
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast(toastConfig.error("Failed to sign in. Try again later."));
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCompleteSignIn = async (username: string) => {
    if (!newUserData) return;

    try {
      await completeSignIn(username, newUserData.email, newUserData.googleId);
      setIsNewUser(false);
      setNewUserData(null);
      toast(toastConfig.success("Account created successfully"));
    } catch (error) {
      console.error("Failed to complete sign-in:", error);
      toast(toastConfig.error("Failed to create account"));
    }
  };

  const handleCloseNewUser = () => {
    toast(toastConfig.info("Account not created because username is not set"));
    setIsNewUser(false);
    setNewUserData(null);
  };

  return {
    isOpen,
    onOpen,
    onClose,
    handleSignIn,
    handleSignOut,
    handleGoogleSignIn: handleGoogleSignInWithFlow,
    // New user flow
    isNewUser,
    newUserData,
    handleCompleteSignIn,
    handleCloseNewUser,
    isSigningIn,
  };
}
