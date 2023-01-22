export type MerkleTreeInStorage = {
  formTitle: string;
  respondentAddresses: string[];
};

export type EncryptedAnswerDecryptionKeyInStorage = {
  formTitle: string;
  encryptedKey: {
    encryptedZipBase64: string;
    encryptedSymmKeyBase64: string;
  };
  resultViewerAddresses: string[];
};

export type FileLocationInStorage = {
  cid: string;
  path: string;
};
