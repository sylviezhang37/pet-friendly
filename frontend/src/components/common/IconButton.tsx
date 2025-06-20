import {
  IconButton as ChakraIconButton,
  IconButtonProps,
} from "@chakra-ui/react";
import { ReactElement } from "react";

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
      variant={getVariant()}
      colorScheme={getColorScheme()}
      borderRadius="full"
      borderWidth={isSelected ? 2 : 1.5}
      _hover={{
        borderWidth: isSelected ? 4 : 2,
        transform: "scale(1.02)",
      }}
      transition="all 0.2s ease-in-out"
      {...props}
    />
  );
};
