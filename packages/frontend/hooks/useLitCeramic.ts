import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { LIT_CERAMIC_INTEGRATION_PARAMS } from "../constants/constants";
import { useAccount } from "./useAccount";

const litCeramicIntegrationAtom = atom<any | null>(null);

export const useLitCeramic = () => {
  const { account } = useAccount();

  const [litCeramicIntegration, setLitCeramicIntegration] = useAtom(
    litCeramicIntegrationAtom
  );

  const initLitCeramic = useCallback(async () => {
    if (litCeramicIntegration) return;

    const LitCeramic =
      // @ts-expect-error
      typeof window !== "undefined" ? await import("lit-ceramic-sdk") : null;

    if (!LitCeramic || !account) return;

    const integration = new LitCeramic.Integration(
      ...LIT_CERAMIC_INTEGRATION_PARAMS
    );
    integration.startLitClient(window);
    setLitCeramicIntegration(integration);
  }, [account, litCeramicIntegration, setLitCeramicIntegration]);

  return {
    litCeramicIntegration,
    initLitCeramic,
  };
};
