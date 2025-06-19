import { Text, Avatar, HStack } from "@chakra-ui/react";
import { useStore } from "@/hooks/useStore";

export default function UserProfile() {
  const user = useStore((state) => state.user);
  const username = user?.username || "Guest";

  return (
    <HStack
      position="absolute"
      zIndex={2}
      top={4}
      left={4}
      spacing={3}
      bg="white"
      px={4}
      py={2}
      borderRadius="full"
      boxShadow="md"
      alignItems="center"
    >
      <Text fontWeight="medium">{username}</Text>
      <Avatar size="sm" name={username} bg="yellow.300" />
    </HStack>
  );
}
