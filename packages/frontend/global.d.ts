import { providers } from "ethers";

declare global {
  interface Window {
    did?: DID;
    ethereum?: providers.ExternalProvider;
  }
}
