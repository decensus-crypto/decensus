import { atom, useAtom } from "jotai";
// @ts-expect-error
import { Integration } from "lit-ceramic-sdk";
import { useCallback } from "react";
import { LIT_CERAMIC_INTEGRATION_PARAMS } from "../constants/constants";
import { useAccount } from "./useAccount";

const litCeramicIntegrationAtom = atom<any | null>(null);

export const useLitCeramic = () => {
  const { account } = useAccount();

  const [litCeramicIntegration, setLitCeramicIntegration] = useAtom(
    litCeramicIntegrationAtom
  );

  const initLitCeramic = useCallback(() => {
    if (litCeramicIntegration || !account) return;

    const integration = new Integration(...LIT_CERAMIC_INTEGRATION_PARAMS);
    integration.startLitClient(window);
    setLitCeramicIntegration(integration);
  }, [account, litCeramicIntegration, setLitCeramicIntegration]);

  return {
    litCeramicIntegration,
    initLitCeramic,
  };
};
