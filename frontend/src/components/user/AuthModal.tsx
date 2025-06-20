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
} from "@chakra-ui/react";
import { User } from "@/models/frontend";
import { ActionButton } from "@/components/common/ActionButton";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  currentUser: User;
  isGuest: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  onSignOut,
  currentUser,
  isGuest,
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
            <ActionButton text="Sign In with Google" onClick={onSignIn} />
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
