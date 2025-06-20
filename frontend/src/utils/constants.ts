import { User } from "@/models/models";

// defaults to NYC
export const DEFAULT_CENTER = {
  lat: 40.758,
  lng: -73.9855,
};

export const GUEST_USER: User = {
  id: "guest",
  username: "Guest",
  googleId: "guest",
  email: "guest@guest.com",
  createdAt: new Date(),
};
