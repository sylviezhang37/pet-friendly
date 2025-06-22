import { Button, Box } from "@chakra-ui/react";

interface ActionButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  text: string;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  isLoading = false,
  text: buttonText,
  borderWidth = 2,
  borderColor = "transparent",
  backgroundColor = "brand.primary",
  textColor = "white",
  size = "sm",
  variant = "default",
  disabled = false,
}) => {
  if (variant === "compact") {
    return (
      <Button
        colorScheme="red"
        size={size}
        onClick={onClick}
        isLoading={isLoading}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <Box textAlign="center" py={1}>
      <Button
        size={size}
        onClick={onClick}
        isLoading={isLoading}
        disabled={disabled}
        borderRadius="full"
        borderColor={borderColor}
        borderWidth={borderWidth}
        backgroundColor={backgroundColor}
        color={textColor}
        colorScheme="red"
        _hover={{
          transform: "scale(1.02)",
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};
