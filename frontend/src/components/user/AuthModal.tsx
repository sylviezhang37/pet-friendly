import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  Text,
  Avatar,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { User } from "@/models/frontend";
import { ActionButton } from "@/components/common/ActionButton";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  onGoogleSignIn: (credentialResponse: CredentialResponse) => void;
  currentUser: User;
  isGuest: boolean;
  isSigningIn?: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSignOut,
  onGoogleSignIn,
  currentUser,
  isGuest,
  isSigningIn = false,
}: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={3} mt={4}>
              <Avatar
                size="md"
                name={currentUser.username}
                bg="brand.primary"
                textColor="white"
              />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">{currentUser.username}</Text>
                {!isGuest && (
                  <Text fontSize="sm" color="gray.600">
                    {currentUser.email}
                  </Text>
                )}
              </VStack>
            </HStack>

            {isGuest ? (
              <Text color="gray.600">
                Sign in with Google to submit reviews and more.
              </Text>
            ) : (
              <Text color="gray.600">
                You can sign out to return to guest mode.
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ActionButton
            text="Cancel"
            onClick={onClose}
            backgroundColor="transparent"
            textColor="brand.primary"
          />
          {isGuest ? (
            isSigningIn ? (
              <Box display="flex" alignItems="center" gap={2} p={3}>
                <Spinner size="sm" color="brand.primary" />
                <Text color="brand.text">Signing in...</Text>
              </Box>
            ) : (
              <GoogleLogin
                onSuccess={onGoogleSignIn}
                onError={() => console.log("Login Failed")}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            )
          ) : (
            <ActionButton
              text="Sign Out"
              onClick={onSignOut}
              backgroundColor="transparent"
              textColor="brand.primary"
            />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
