import { Form } from "./core";

export type FormInStorage = {
  form: Form;
  respondentAddresses: string[];
};

export type AnswerDecryptionKeyInStorage = {
  formTitle: string;
  encryptedKey: {
    encryptedZipBase64: string;
    encryptedSymmKeyBase64: string;
  };
  resultViewerAddresses: string[];
};
