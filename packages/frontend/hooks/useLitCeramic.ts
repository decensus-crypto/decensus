import { atom, useAtom } from "jotai";
// @ts-expect-error
import { Integration } from "lit-ceramic-sdk";
import { useCallback } from "react";
import { LIT_CERAMIC_INTEGRATION_PARAMS } from "../constants/constants";

const litCeramicIntegrationAtom = atom<any | null>(null);

export const useLitCeramic = () => {
  const [litCeramicIntegration, setLitCeramicIntegration] = useAtom(
    litCeramicIntegrationAtom
  );

  const initLitCeramic = useCallback(() => {
    if (litCeramicIntegration) return;

    const integration = new Integration(...LIT_CERAMIC_INTEGRATION_PARAMS);
    integration.startLitClient(window);
    setLitCeramicIntegration(integration);
  }, [litCeramicIntegration, setLitCeramicIntegration]);

  return {
    litCeramicIntegration,
    initLitCeramic,
  };
};
