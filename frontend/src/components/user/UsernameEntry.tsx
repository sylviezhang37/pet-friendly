import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { LuShuffle } from "react-icons/lu";
import { generateRandomUsername } from "@/lib/utils";
import { ActionButton } from "@/components/common/ActionButton";

interface UsernameSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (username: string) => void;
}

export default function UsernameSelection({
  isOpen,
  onClose,
  onComplete,
}: UsernameSelectionProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsername(generateRandomUsername());
    }
  }, [isOpen]);

  const handleShuffle = () => {
    setUsername(generateRandomUsername());
  };

  const handleComplete = async () => {
    if (!username.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onComplete(username.trim());
      onClose();
    } catch (error) {
      console.error("Failed to complete sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <ModalBody>
          <VStack mt={4} align="stretch">
            <Text color="gray.600" fontSize="md">
              Welcome! Enter or pick a username.
            </Text>

            <VStack spacing={3} align="stretch">
              <HStack spacing={2}>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  size="md"
                />
                <IconButton
                  aria-label="Generate random username"
                  icon={<LuShuffle />}
                  onClick={handleShuffle}
                  variant="outline"
                  size="md"
                />
              </HStack>
              <Text
                fontSize="xs"
                color="gray.500"
                textAlign="right"
                style={{
                  fontStyle: "italic",
                }}
              >
                shuffle
              </Text>
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ActionButton
            text="Cancel"
            onClick={onClose}
            backgroundColor="transparent"
            textColor="brand.primary"
          />
          <ActionButton
            text="Complete Sign Up"
            onClick={handleComplete}
            isLoading={isLoading}
            // disabled={!username.trim()}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
