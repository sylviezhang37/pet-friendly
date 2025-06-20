import { Icon } from "@chakra-ui/react";
import { MdOutlineHeartBroken } from "react-icons/md";
import { LuDog } from "react-icons/lu";

interface PetIconProps {
  isPetFriendly: boolean;
  size?: number;
  color?: string;
}

export const PetIcon: React.FC<PetIconProps> = ({
  isPetFriendly,
  size = 5,
  color,
}) => {
  const defaultColor = isPetFriendly ? "green.500" : "red.700";

  return (
    <Icon
      as={isPetFriendly ? LuDog : MdOutlineHeartBroken}
      color={color || defaultColor}
      boxSize={size}
    />
  );
};
