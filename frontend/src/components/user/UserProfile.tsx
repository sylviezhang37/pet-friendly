import { Text, Avatar, HStack } from "@chakra-ui/react";
import { useStore } from "@/hooks/useStore";
import { GUEST_USER } from "@/lib/constants";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "./AuthModal";
import UsernameSelection from "./UsernameEntry";

interface UserProfileProps {
  isMobile: boolean;
}

export default function UserProfile({ isMobile }: UserProfileProps) {
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
    isSigningIn,
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
        left={{ base: 2, md: 4 }}
        spacing={3}
        bg="brand.background"
        px={isMobile ? 2 : 4}
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
        _active={{
          transform: "scale(0.95)",
        }}
        transition="all 0.2s"
        sx={{ touchAction: "manipulation" }}
      >
        <Avatar
          size="sm"
          name={currentUser.username}
          bg="brand.primary"
          textColor="white"
        />
        {!isMobile && <Text fontWeight="medium">{currentUser.username}</Text>}
      </HStack>

      <AuthModal
        isOpen={isOpen}
        onClose={onClose}
        onSignOut={handleSignOut}
        onGoogleSignIn={handleGoogleSignIn}
        currentUser={currentUser}
        isGuest={isGuest}
        isSigningIn={isSigningIn}
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
