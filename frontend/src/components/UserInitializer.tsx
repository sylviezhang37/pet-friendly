"use client";
import { useEffect } from "react";
import { getOrCreateUser } from "@/lib/user";
import { useStore } from "@/hooks/useStore";

export default function UserInitializer() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const { userId, username } = getOrCreateUser();
    setUser(userId, username);
  }, [setUser]);

  return null;
}
