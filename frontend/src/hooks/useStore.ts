import { create } from "zustand";
import { User } from "@/models/frontend";

// zustand holds user info globally (a state manager)
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface PlaceState {
  selectedPlaceId: string | null;
  setSelectedPlaceId: (placeId: string | null) => void;
}

interface AppState extends UserState, PlaceState {}

// useStore "reads" user info from zustand
export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  selectedPlaceId: null,
  setSelectedPlaceId: (selectedPlaceId) => set({ selectedPlaceId }),
}));
