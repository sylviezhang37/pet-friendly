import { Text, Avatar, HStack } from "@chakra-ui/react";
import { useStore } from "@/hooks/useStore";
import { GUEST_USER } from "@/utils/constants";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "./AuthModal";

export default function UserProfile() {
  const user = useStore((state) => state.user);
  const { isOpen, onOpen, onClose, handleSignIn, handleSignOut } =
    useAuthModal();

  // Use guest user when no user is signed in
  const currentUser = user || GUEST_USER;
  const isGuest = !user;

  const handleProfileClick = () => {
    onOpen();
  };

  return (
    <>
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
        cursor="pointer"
        onClick={handleProfileClick}
        _hover={{
          boxShadow: "lg",
          transform: "translateY(-1px)",
        }}
        transition="all 0.2s"
      >
        <Avatar size="sm" name={currentUser.username} bg="yellow.300" />
        <Text fontWeight="medium">{currentUser.username}</Text>
      </HStack>

      <AuthModal
        isOpen={isOpen}
        onClose={onClose}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        currentUser={currentUser}
        isGuest={isGuest}
      />
    </>
  );
}
