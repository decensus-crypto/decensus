import {
  EncryptedAnswerDecryptionKeyInStorage,
  FileLocationInStorage,
  MerkleTreeInStorage,
} from "./storage";

export type PostMerkleTreeRequestBody = MerkleTreeInStorage;

export type PostMerkleTreeResponse = FileLocationInStorage;

export type PostEncryptedAnswerDecryptionKeyRequestBody = EncryptedAnswerDecryptionKeyInStorage;

export type PostEncryptedAnswerDecryptionKeyResponse = FileLocationInStorage;
