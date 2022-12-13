import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";
import type { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { ResolverRegistry } from "did-resolver";
import { DID } from "dids";
import { atom, useAtom } from "jotai";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { useCallback } from "react";
import { useAccount } from "../useAccount";

const CERAMIC_URL = "https://ceramic-clay.3boxlabs.com";

const ceramicAtom = atom<CeramicClient | null>(null);

export const useCeramic = () => {
  const { getDidProvider } = useAccount();
  const [ceramic, setCeramic] = useAtom(ceramicAtom);

  const initCeramic = useCallback(async () => {
    if (ceramic) return;

    // dynamic import due to esm
    const _ceramicClient = await import("@ceramicnetwork/http-client");

    const _ceramic = new _ceramicClient.CeramicClient(CERAMIC_URL);
    setCeramic(_ceramic);
  }, [ceramic, setCeramic]);

  const authenticateCeramic = useCallback(async () => {
    if (!ceramic) return;

    const provider = await getDidProvider();
    const resolverRegistry: ResolverRegistry = {
      ...get3IDResolver(ceramic),
      ...getKeyResolver(),
    };
    const did = new DID({
      provider: provider,
      resolver: resolverRegistry,
    });

    await did.authenticate();
    await ceramic.setDID(did);
  }, [ceramic, getDidProvider]);

  const createDocument = useCallback(
    async (content: string) => {
      if (!ceramic) throw new Error("Ceramic is not initialized");

      const doc = await TileDocument.create(ceramic, content);

      return doc.id;
    },
    [ceramic],
  );

  const loadDocument = useCallback(
    async (id: string) => {
      if (!ceramic) throw new Error("Ceramic is not initialized");

      return (await (
        await TileDocument.load(ceramic, id)
      ).content) as string;
    },
    [ceramic],
  );

  return {
    initCeramic,
    authenticateCeramic,
    createDocument,
    loadDocument,
    isCeramicReady: !!ceramic,
  };
};
