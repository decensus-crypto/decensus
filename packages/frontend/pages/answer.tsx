// AnswerForm component is dynamically imported because "lit-ceramic-sdk" used in it emits error when loaded in server-side.
import dynamic from "next/dynamic";
const AnswerForm = dynamic(() => import("../components/AnswerForm"), {
  ssr: false,
});

import { Container } from "@chakra-ui/react";
import { ReactElement } from "react";
import Layout from "../layouts/default";

const Answer = (page: ReactElement) => {
  return (
    <Layout>
      <Container>
        <AnswerForm />
      </Container>
    </Layout>
  );
};

export default Answer;
