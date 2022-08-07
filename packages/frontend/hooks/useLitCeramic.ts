import { atom, useAtom } from "jotai";
// @ts-expect-error
import { Integration } from "lit-ceramic-sdk";
import { LIT_CERAMIC_INTEGRATION_PARAMS } from "../constants/constants";

const litCeramicIntegrationAtom = atom<any | null>(null);

export const useLitCeramic = () => {
  const [litCeramicIntegration, setLitCeramicIntegration] = useAtom(
    litCeramicIntegrationAtom
  );

  const initLitCeramic = () => {
    if (litCeramicIntegration) return;

    const integration = new Integration(...LIT_CERAMIC_INTEGRATION_PARAMS);
    integration.startLitClient(window);
    setLitCeramicIntegration(integration);
  };

  return {
    litCeramicIntegration,
    initLitCeramic,
  };
};
