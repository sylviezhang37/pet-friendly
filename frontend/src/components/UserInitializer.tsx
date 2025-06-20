"use client";
import { useEffect } from "react";
import { getOrCreateUser } from "@/hooks/useUser";
import { useStore } from "@/hooks/useStore";
import { User } from "@/models/models";

// sets up the user in the global state
export default function UserInitializer() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const user: User | null = getOrCreateUser();
    setUser(user);
  }, [setUser]);

  return null;
}
