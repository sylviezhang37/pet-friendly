import { Box, Text, HStack, Textarea, Collapse } from "@chakra-ui/react";
import { Review } from "@/models/frontend";
import { PetIcon } from "../common/PetIcon";
import { ActionButton } from "@/components/common/ActionButton";
import { IconButton } from "@/components/common/IconButton";

interface ReviewSubmissionProps {
  selected: "confirm" | "deny" | null;
  comment: string;
  submitted: boolean;
  userReview: Review | null;
  onSelect: (type: "confirm" | "deny") => void;
  onCancel: () => void;
  onAddReview: () => void;
  onCommentChange: (comment: string) => void;
}

/**
 * Pure UI component for review submission.
 * Receives all state and handlers as props.
 */
export function ReviewSubmission({
  selected,
  comment,
  submitted,
  userReview,
  onSelect,
  onCancel,
  onAddReview: onPostReview,
  onCommentChange,
}: ReviewSubmissionProps) {
  // Case 1: User has submitted a review in a previous session
  if (userReview && !submitted) {
    return (
      <Box mb={2} p={4} borderRadius="md" textAlign="center">
        <Text>You&apos;ve submitted a review for this place.</Text>
      </Box>
    );
  }

  // Case 2: User has not submitted a review yet
  return (
    <>
      <Collapse in={!userReview} unmountOnExit>
        <HStack spacing={4} mt={1} mb={2} justifyContent="center">
          <IconButton
            aria-label="Confirm pet-friendly"
            icon={<PetIcon isPetFriendly={true} />}
            isSelected={selected === "confirm"}
            colorScheme="green"
            onClick={() => onSelect("confirm")}
            isDisabled={!!userReview}
          />
          <IconButton
            aria-label="Deny pet-friendly"
            icon={<PetIcon isPetFriendly={false} />}
            isSelected={selected === "deny"}
            colorScheme="red"
            onClick={() => onSelect("deny")}
            isDisabled={!!userReview}
          />
        </HStack>
        <Collapse in={!!selected} animateOpacity>
          <Box p={3} borderRadius="md">
            <Textarea
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              mb={3}
              bg="white"
            />
            <HStack justify="flex-end">
              <ActionButton
                text="Cancel"
                onClick={onCancel}
                backgroundColor="transparent"
                textColor="brand.primary"
              />
              <ActionButton text="Post" onClick={onPostReview} />
            </HStack>
          </Box>
        </Collapse>
      </Collapse>

      {/* Case 3: User submits a review in current session */}
      {userReview && submitted && (
        <Collapse in={submitted} unmountOnExit>
          <Box mb={2} p={4} borderRadius="md" textAlign="center">
            <Text color="green.700">
              Review submitted. Thanks for contributing to the community!
            </Text>
          </Box>
        </Collapse>
      )}
    </>
  );
}
