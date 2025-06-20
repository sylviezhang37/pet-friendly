import {
  Box,
  Text,
  HStack,
  Button,
  Textarea,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { Review } from "@/models/frontend";
import { PiThumbsUpBold, PiThumbsDownBold } from "react-icons/pi";

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
  onAddReview,
  onCommentChange,
}: ReviewSubmissionProps) {
  // Case 1: User has submitted a review in a previous session
  if (userReview && !submitted) {
    return (
      <Box mb={6} p={4} bg="green.50" borderRadius="md" textAlign="center">
        <Text color="green.700">
          You&apos;ve submitted a review for this place.
        </Text>
      </Box>
    );
  }

  // Case 2: User has not submitted a review yet
  return (
    <>
      <Collapse in={!userReview} unmountOnExit>
        <HStack spacing={4} mb={2} justifyContent="center">
          <IconButton
            aria-label="Confirm pet-friendly"
            icon={<PiThumbsUpBold />}
            colorScheme={selected === "confirm" ? "yellow" : undefined}
            variant={selected === "confirm" ? "solid" : "outline"}
            onClick={() => onSelect("confirm")}
            isDisabled={!!userReview}
          />
          <IconButton
            aria-label="Deny pet-friendly"
            icon={<PiThumbsDownBold />}
            colorScheme={selected === "deny" ? "yellow" : undefined}
            variant={selected === "deny" ? "solid" : "outline"}
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
              <Button onClick={onCancel} variant="ghost">
                Cancel
              </Button>
              <Button
                onClick={onAddReview}
                colorScheme="yellow"
                fontWeight="bold"
              >
                Post
              </Button>
            </HStack>
          </Box>
        </Collapse>
      </Collapse>

      {/* Case 3: User submits a review in current session */}
      {userReview && submitted && (
        <Collapse in={submitted} unmountOnExit>
          <Box mb={6} p={4} bg="green.50" borderRadius="md" textAlign="center">
            <Text color="green.700">Review submitted</Text>
          </Box>
        </Collapse>
      )}
    </>
  );
}
