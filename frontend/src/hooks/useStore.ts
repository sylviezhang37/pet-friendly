import { create } from "zustand";

interface UserState {
  userId: string | null;
  username: string | null;
  setUser: (userId: string, username: string) => void;
}

interface PlaceState {
  selectedPlaceId: string | null;
  setSelectedPlaceId: (placeId: string | null) => void;
}

interface AppState extends UserState, PlaceState {}

// zustand holds user info globally (a state manager)
// useStore then "reads" user info from zustand
export const useStore = create<AppState>((set) => ({
  userId: null,
  username: null,
  setUser: (userId, username) => set({ userId, username }),
  selectedPlaceId: null,
  setSelectedPlaceId: (selectedPlaceId) => set({ selectedPlaceId }),
}));
