import { useStore } from "./useStore";
import { userService } from "@/api/user-service";
import { CredentialResponse } from "@react-oauth/google";

export function useGoogleAuth() {
  const setUser = useStore((state) => state.setUser);

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    try {
      console.log("credentialResponse", credentialResponse);

      if (!credentialResponse.credential) {
        console.error("No credential received from Google");
        return;
      }

      const user = await userService.signInWithGoogle(
        credentialResponse.credential
      );
      setUser(user);
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return { handleGoogleSignIn, logout };
}
