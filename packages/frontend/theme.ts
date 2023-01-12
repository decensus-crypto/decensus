import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  components: {
    Heading: { baseStyle: { color: "white", fontWeight: "light" } },
    Text: { baseStyle: { color: "white", fontWeight: "light" } },
    Button: {
      baseStyle: {
        fontWeight: "light",
      },
    },
    Divider: { baseStyle: { color: "gray.700" } },
    Spinner: { baseStyle: { color: "white" } },
    FormLabel: { baseStyle: { fontSize: "sm", color: "white" } },
  },
});
