// FormDisplay component is dynamically imported because "lit-ceramic-sdk" used in it emits error when loaded in server-side.

import dynamic from "next/dynamic";
import Layout from "../../layouts/default";
const AnswerFormTest = dynamic(
  () => import("../../components/AnswerFormTest"),
  {
    ssr: false,
  }
);

const Form = () => {
  return (
    <Layout>
      <AnswerFormTest />
    </Layout>
  );
};

export default Form;
