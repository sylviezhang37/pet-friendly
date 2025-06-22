import { apiClient } from "@/api/client";
import { User } from "@/models/frontend";
import { BackendUser } from "@/models/backend";

type UserResponse = {
  user: BackendUser;
};

type SignInResponse =
  | { isNewUser: true; user: GoogleUserInfo }
  | { isNewUser: false; user: BackendUser }
  | { isNewUser: false; user: User };

type GoogleUserInfo = {
  sub: string;
  email: string;
  name: string;
};

type CompleteSignInRequest = {
  username: string;
  email: string;
  googleId: string;
};

const mapToUser = (data: BackendUser): User => ({
  id: String(data.id),
  username: data.username,
  googleId: String(data.googleId),
  email: data.email,
  createdAt: new Date(data.createdAt),
});

export const userService = {
  signInWithGoogle: async (idToken: string): Promise<SignInResponse> => {
    const response = await apiClient.post<SignInResponse>(
      "/api/v0/auth/google",
      {
        idToken,
      }
    );

    if (response.isNewUser) return response;
    return {
      isNewUser: false,
      user: mapToUser(response.user as BackendUser),
    };
  },

  completeGoogleSignIn: async (
    userData: CompleteSignInRequest
  ): Promise<User> => {
    const { user } = await apiClient.post<UserResponse>(
      "/api/v0/auth/google/complete",
      userData
    );
    return mapToUser(user);
  },

  getUser: async (id: string): Promise<User> => {
    const { user } = await apiClient.get<UserResponse>(`/api/v0/users/${id}`);
    return mapToUser(user);
  },
};

export default userService;
