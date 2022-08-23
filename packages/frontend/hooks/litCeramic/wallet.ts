import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import type { DIDProvider } from "dids";
// @ts-expect-error
import LitJsSdk from "lit-js-sdk";

// @ts-ignore
export const threeID = new ThreeIdConnect();

export async function getProvider(): Promise<DIDProvider> {
  const { web3, account } = await LitJsSdk.connectWeb3();
  await threeID.connect(new EthereumAuthProvider(web3.provider, account));
  return threeID.getDidProvider();
}

export async function getAddress(): Promise<String> {
  const { web3, account } = await LitJsSdk.connectWeb3();
  return account;
}
