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
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { LuShuffle } from "react-icons/lu";
import { generateRandomUsername, isValidUsername } from "@/lib/utils";
import { ActionButton } from "@/components/common/ActionButton";
import { apiClient } from "@/api/client";
import { IconButton } from "../common/IconButton";

interface UsernameSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (username: string) => void;
}

type ValidationState =
  | "idle"
  | "validating"
  | "valid"
  | "invalid"
  | "unavailable";

export default function UsernameSelection({
  isOpen,
  onClose,
  onComplete,
}: UsernameSelectionProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUsername(generateRandomUsername());
      setValidationState("idle");
      setValidationMessage("");
    }
  }, [isOpen]);

  const checkUsernameAvailability = useCallback(
    async (usernameToCheck: string) => {
      if (!usernameToCheck.trim()) {
        setValidationState("idle");
        setValidationMessage("");
        return;
      }

      if (!isValidUsername(usernameToCheck)) {
        setValidationState("invalid");
        setValidationMessage("Must be between 5 and 20 characters");
        return;
      }

      setValidationState("validating");
      setValidationMessage("Checking...");

      try {
        const isAvailable = await apiClient.get<boolean>(
          `/api/v0/user/${encodeURIComponent(usernameToCheck)}/available`
        );

        if (isAvailable) {
          setValidationState("valid");
          setValidationMessage("Available");
        } else {
          setValidationState("unavailable");
          setValidationMessage("Not available");
        }
      } catch {
        setValidationState("invalid");
        setValidationMessage("Error checking availability");
      }
    },
    []
  );

  // debounced validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username.trim()) {
        checkUsernameAvailability(username);
      } else {
        setValidationState("idle");
        setValidationMessage("");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, checkUsernameAvailability]);

  const handleShuffle = () => {
    setUsername(generateRandomUsername());
  };

  const handleComplete = async () => {
    if (!username.trim() || validationState !== "valid") {
      return;
    }

    setIsLoading(true);
    try {
      await onComplete(username.trim());
    } catch (error) {
      console.error("Failed to complete sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getValidationColor = () => {
    switch (validationState) {
      case "valid":
        return "brand.primary";
      case "invalid":
      case "unavailable":
        return "red.500";
      default:
        return "gray.500";
    }
  };

  const isFormValid = validationState === "valid" && username.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <ModalBody>
          <VStack mt={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold" ml={2}>
              Welcome!
            </Text>
            <Text fontSize="md" ml={2}>
              Generate a random username or enter your own.
            </Text>

            <VStack align="stretch">
              <HStack mt={4}>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=" Enter username"
                  size="md"
                  borderRadius="full"
                />
                <IconButton
                  aria-label="Generate random username"
                  icon={<LuShuffle />}
                  onClick={handleShuffle}
                  variant="outline"
                  size="md"
                />
              </HStack>
              {validationMessage && (
                <Text
                  fontSize="xs"
                  color={getValidationColor()}
                  textAlign="right"
                  style={{
                    fontStyle: "italic",
                  }}
                  mr={14}
                >
                  {validationMessage}
                </Text>
              )}
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
            text="Finish Sign Up"
            onClick={handleComplete}
            isLoading={isLoading}
            disabled={!isFormValid}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
