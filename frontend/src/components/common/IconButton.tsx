import {
  IconButton as ChakraIconButton,
  IconButtonProps,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { useTouchHandler } from "@/hooks/useTouchHandler";

interface CustomIconButtonProps extends Omit<IconButtonProps, "icon"> {
  icon: ReactElement;
  isSelected?: boolean;
  colorScheme?: string;
  size?: "sm" | "md" | "lg";
}

export const IconButton: React.FC<CustomIconButtonProps> = ({
  icon,
  isSelected = false,
  colorScheme,
  size = "md",
  variant,
  ...props
}) => {
  const { handleTouchStart, handleTouchEnd, handleClick } = useTouchHandler({
    onClick: (e) => props.onClick?.(e),
  });
  // Determine color scheme based on selection state
  const getColorScheme = () => {
    if (colorScheme) return colorScheme;
    if (isSelected) return "brand";
    return undefined;
  };

  // Determine variant based on selection state
  const getVariant = () => {
    if (variant) return variant;
    if (isSelected) return "solid";
    return "outline";
  };

  return (
    <ChakraIconButton
      icon={icon}
      size={size}
      borderRadius="full"
      variant={getVariant()}
      colorScheme={getColorScheme()}
      borderWidth={2}
      _hover={{ borderWidth: isSelected ? 4 : 2, transform: "scale(1.05)" }}
      _active={{ transform: "scale(0.95)" }}
      transition="all 0.2s ease-in-out"
      sx={{ touchAction: "manipulation" }}
      {...props}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
};
