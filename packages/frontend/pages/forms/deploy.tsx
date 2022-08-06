// FormDeploy component is dynamically imported because "lit-ceramic-sdk" used in it emits error when loaded in server-side.

import dynamic from "next/dynamic";
const FormDeploy = dynamic(() => import("../../components/FormDeploy"), {
  ssr: false,
});

const Deploy = () => {
  return <FormDeploy />;
};

export default Deploy;
