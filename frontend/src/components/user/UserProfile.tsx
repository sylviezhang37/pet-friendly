import { Text, Avatar, HStack } from "@chakra-ui/react";
import { useStore } from "@/hooks/useStore";
import { GUEST_USER } from "@/lib/constants";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "./AuthModal";
import UsernameSelection from "./UsernameEntry";

export default function UserProfile() {
  const user = useStore((state) => state.user);
  const {
    isOpen,
    onOpen,
    onClose,
    handleSignOut,
    handleGoogleSignIn,
    isNewUser,
    newUserData,
    handleCompleteSignIn,
    handleCloseNewUser,
  } = useAuthModal();

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
        bg="brand.background"
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
        <Avatar
          size="sm"
          name={currentUser.username}
          bg="brand.primary"
          textColor="white"
        />
        <Text fontWeight="medium">{currentUser.username}</Text>
      </HStack>

      <AuthModal
        isOpen={isOpen}
        onClose={onClose}
        onSignOut={handleSignOut}
        onGoogleSignIn={handleGoogleSignIn}
        currentUser={currentUser}
        isGuest={isGuest}
      />

      {/* username selection for new users */}
      {newUserData && (
        <UsernameSelection
          isOpen={isNewUser}
          onClose={handleCloseNewUser}
          onComplete={handleCompleteSignIn}
        />
      )}
    </>
  );
}
