import { extendTheme } from "@chakra-ui/react";
import type { ComponentStyleConfig } from "@chakra-ui/theme";

// You can also use the more specific type for
// a single part component: ComponentSingleStyleConfig
const Button: ComponentStyleConfig = {
  variants: {
    outline: {
      color: "white",
      borderColor: "gray.500",
      borderWidth: "1px",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "sm",
    variant: "outline",
  },
};

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: "#FC8CC9",
  },
  components: {
    Button,
  },
});
