import { apiClient } from "@/api/client";
import { User } from "@/models/frontend";
import { BackendUser } from "@/models/backend";

type UserResponse = {
  user: BackendUser;
};

// type NewUserRequest = {
//   username?: string;
//   anonymous?: boolean;
// };

const mapToUser = (data: BackendUser): User => ({
  id: data.id,
  username: data.username,
  googleId: data.googleId,
  email: data.email,
  createdAt: new Date(data.createdAt),
});

export const userService = {
  // createUser: async (reqBody: NewUserRequest): Promise<User> => {
  //   const { user } = await apiClient.post<UserResponse>(
  //     "/api/v0/users",
  //     reqBody
  //   );
  //   return mapToUser(user);
  // },

  signInWithGoogle: async (idToken: string): Promise<User> => {
    const { user } = await apiClient.post<UserResponse>("/api/v0/auth/google", {
      idToken,
    });
    return mapToUser(user);
  },

  getUser: async (id: string): Promise<User> => {
    const { user } = await apiClient.get<UserResponse>(`/api/v0/users/${id}`);
    return mapToUser(user);
  },
};

export default userService;
