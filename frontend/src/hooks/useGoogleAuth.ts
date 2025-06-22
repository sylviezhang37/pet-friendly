import { useStore } from "./useStore";
import { userService } from "@/api/user-service";
import { CredentialResponse } from "@react-oauth/google";
import { User } from "@/models/frontend";

export function useGoogleAuth() {
  const setUser = useStore((state) => state.setUser);

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    try {
      console.log("credentialResponse", credentialResponse);

      if (!credentialResponse.credential) {
        console.error("No credential received from Google");
        return;
      }

      const signInResponse = await userService.signInWithGoogle(
        credentialResponse.credential
      );

      if (signInResponse.isNewUser) {
        return signInResponse;
      } else {
        const user = signInResponse.user as User;
        setUser(user);
        return null;
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      return null;
    }
  };

  const completeSignIn = async (
    username: string,
    email: string,
    googleId: string
  ) => {
    try {
      const user = await userService.completeGoogleSignIn({
        username,
        email,
        googleId,
      });
      setUser(user);
      return user;
    } catch (error) {
      console.error("Complete sign-in failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return { handleGoogleSignIn, completeSignIn, logout };
}
