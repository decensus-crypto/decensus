import type { ReactElement } from "react";
import ResultBody from "../components/ResultBody";
import Layout from "../layouts/default";

const Root = (page: ReactElement) => {
  return (
    <Layout>
      <ResultBody />
    </Layout>
  );
};

export default Root;
