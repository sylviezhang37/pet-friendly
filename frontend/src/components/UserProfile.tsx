import { Text, Avatar, HStack, Button } from "@chakra-ui/react";
import { useStore } from "@/hooks/useStore";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { GUEST_USER } from "@/utils/constants";

export default function UserProfile() {
  const user = useStore((state) => state.user);
  const { login, logout } = useGoogleAuth();

  // Use guest user when no user is signed in
  const currentUser = user || GUEST_USER;
  const isGuest = !user;

  console.log("user", user);

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
      <Avatar size="sm" name={currentUser.username} bg="yellow.300" />
      <Text fontWeight="medium">{currentUser.username}</Text>
      {isGuest ? (
        <Button size="sm" onClick={() => login()}>
          Sign In
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={logout}>
          Sign Out
        </Button>
      )}
    </HStack>
  );
}
