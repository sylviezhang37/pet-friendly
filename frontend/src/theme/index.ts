import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    primary: "#87A96B", // Soft sage green as primary
    background: "#FCFBF7", // Warm cream/sand for backgrounds
    accent: "#FF8A65", // Coral accent for CTAs and highlights
    text: "#2D3748", // Charcoal gray for text
  },
  yellow: {
    50: "#F7F3E9",
    100: "#F0E8D4",
    200: "#E1D1A9",
    300: "#D2BA7E",
    400: "#C3A353",
    500: "#87A96B", // primary sage green
  },
  gray: {
    50: "#F7F3E9", // warm cream background
    100: "#EDE7D8",
    200: "#D4CBB8",
    300: "#BBAF98",
    400: "#A29378",
    500: "#2D3748", // charcoal text color
    600: "#2A3444",
    700: "#273040",
    800: "#242C3C",
    900: "#212838",
  },
  red: {
    50: "#FFE8E0",
    100: "#FFD1C0",
    200: "#FFA380",
    300: "#FF8A65", // coral accent
    400: "#FF6B40",
    500: "#FF4C1B",
  },
  green: {
    50: "#F0F7ED",
    100: "#E1EFDB",
    200: "#C3DFB7",
    300: "#A5CF93",
    400: "#87A96B", // primary sage green
    500: "#6B8A55",
  },
};

const components = {
  Button: {
    defaultProps: {
      colorScheme: "brand",
    },
    variants: {
      solid: {
        bg: "brand.accent",
        color: "white",
        _hover: {
          bg: "red.400",
        },
      },
      outline: {
        borderColor: "brand.primary",
        color: "brand.primary",
        _hover: {
          bg: "brand.primary",
          color: "white",
        },
      },
    },
  },
  Text: {
    baseStyle: {
      color: "brand.text",
    },
  },
  Heading: {
    baseStyle: {
      color: "brand.text",
    },
  },
};

const styles = {
  global: {
    body: {
      bg: "brand.background",
      color: "brand.text",
    },
  },
};

export const theme = extendTheme({
  config,
  colors,
  components,
  styles,
});
