import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import TagManager from "react-gtm-module";
import "../styles/globals.css";
import { theme } from "../theme";

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    TagManager.initialize({ gtmId: "GTM-WQPNLB5" });
  }, []);

  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
