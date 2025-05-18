import { apiClient } from "@/data/api-client";
import { User } from "@/models/models";
import { BackendUser, NewUserRequest } from "@/models/backend-models";

const mapToUser = (data: BackendUser): User => ({
  id: data.id,
  username: data.username,
});

export const userService = {
  createUser: async (reqBody: NewUserRequest): Promise<User> => {
    const user = await apiClient.post<BackendUser>("/api/v0/users", reqBody);
    return mapToUser(user);
  },

  getUser: async (id: string): Promise<User> => {
    const user = await apiClient.get<BackendUser>(`/api/v0/users/${id}`);
    return mapToUser(user);
  },
};

export default userService;
