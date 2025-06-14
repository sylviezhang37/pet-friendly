import { apiClient } from "@/api/client";
import { User } from "@/models/models";
import { BackendUser } from "@/models/backend-models";

type UserResponse = {
  user: BackendUser;
};

type NewUserRequest = {
  username?: string;
  anonymous?: boolean;
};

const mapToUser = (data: BackendUser): User => ({
  id: data.id,
  username: data.username,
});

export const userService = {
  // TODO change reqBody to a FE user model
  createUser: async (reqBody: NewUserRequest): Promise<User> => {
    const { user } = await apiClient.post<UserResponse>(
      "/api/v0/users",
      reqBody
    );
    return mapToUser(user);
  },

  getUser: async (id: string): Promise<User> => {
    const { user } = await apiClient.get<UserResponse>(`/api/v0/users/${id}`);
    return mapToUser(user);
  },
};

export default userService;
