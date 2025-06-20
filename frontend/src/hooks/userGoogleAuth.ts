import { useGoogleLogin } from "@react-oauth/google";
import { useStore } from "./useStore";
import { userService } from "@/api/user-service";

export function useGoogleAuth() {
  const setUser = useStore((state) => state.setUser);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const user = await userService.signInWithGoogle(response.access_token);
        setUser(user);
      } catch (error) {
        console.error("Google sign-in failed:", error);
      }
    },
    onError: (error) => {
      console.error("Google sign-in error:", error);
    },
  });

  return { login };
}
