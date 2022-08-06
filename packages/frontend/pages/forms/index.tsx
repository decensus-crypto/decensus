// FormDisplay component is dynamically imported because "lit-ceramic-sdk" used in it emits error when loaded in server-side.

import dynamic from "next/dynamic";
const FormDisplay = dynamic(() => import("../../components/FormDisplay"), {
  ssr: false,
});

const Form = () => {
  return <FormDisplay />;
};

export default Form;
