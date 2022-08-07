import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import Layout from "../layouts/default";
const ResultBody = dynamic(() => import("../components/ResultBody"), {
  ssr: false,
});

const Root = (page: ReactElement) => {
  return (
    <Layout>
      <Box w={"full"} mb={32}>
        <ResultBody />
      </Box>
    </Layout>
  );
};

export default Root;
