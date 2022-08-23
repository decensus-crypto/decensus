import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { ResolverRegistry } from "did-resolver";
import { DID } from "dids";
import { atom, useAtom } from "jotai";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { useCallback } from "react";
import { getProvider } from "./wallet";

const CERAMIC_URL = "https://ceramic-clay.3boxlabs.com";

const ceramicAtom = atom<CeramicClient | null>(null);

export const useCeramic = () => {
  const [ceramic, setCeramic] = useAtom(ceramicAtom);

  const initCeramic = useCallback(() => {
    if (ceramic) return;

    const _ceramic = new CeramicClient(CERAMIC_URL);
    setCeramic(_ceramic);
  }, [ceramic, setCeramic]);

  const authenticateCeramic = useCallback(async () => {
    if (!ceramic) return;

    const provider = await getProvider();
    const resolverRegistry: ResolverRegistry = {
      // @ts-expect-error
      ...get3IDResolver(ceramic),
      ...getKeyResolver(),
    };
    const did = new DID({
      provider: provider,
      resolver: resolverRegistry,
    });

    await did.authenticate();
    await ceramic.setDID(did);
  }, [ceramic]);

  const createDocument = useCallback(
    async (content: string) => {
      if (!ceramic) return;

      const doc = await TileDocument.create(ceramic, content);

      return doc.id;
    },
    [ceramic]
  );

  const loadDocument = useCallback(
    async (id: string) => {
      if (!ceramic) return;

      return await TileDocument.load(ceramic, id);
    },
    [ceramic]
  );

  return { initCeramic, authenticateCeramic, createDocument, loadDocument };
};
