// @ts-nocheck
// eslint-disable
// This file is generated by create-validator-ts
import Ajv from 'ajv';
import type * as apiTypes from './api-types';

export const SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
        "PostMerkleTreeRequestBody": {
            "$ref": "#/definitions/MerkleTreeInStorage"
        },
        "MerkleTreeInStorage": {
            "type": "object",
            "properties": {
                "formTitle": {
                    "type": "string"
                },
                "respondentAddresses": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "formTitle",
                "respondentAddresses"
            ],
            "additionalProperties": false
        },
        "PostEncryptedAnswerDecryptionKeyRequestBody": {
            "$ref": "#/definitions/EncryptedAnswerDecryptionKeyInStorage"
        },
        "EncryptedAnswerDecryptionKeyInStorage": {
            "type": "object",
            "properties": {
                "formTitle": {
                    "type": "string"
                },
                "encryptedKey": {
                    "type": "object",
                    "properties": {
                        "encryptedZipBase64": {
                            "type": "string"
                        },
                        "encryptedSymmKeyBase64": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "encryptedZipBase64",
                        "encryptedSymmKeyBase64"
                    ],
                    "additionalProperties": false
                },
                "resultViewerAddresses": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "formTitle",
                "encryptedKey",
                "resultViewerAddresses"
            ],
            "additionalProperties": false
        }
    }
};
const ajv = new Ajv({ removeAdditional: true }).addSchema(SCHEMA, "SCHEMA");
export function validatePostMerkleTreeRequestBody(payload: unknown): apiTypes.PostMerkleTreeRequestBody {
  /** Schema is defined in {@link SCHEMA.definitions.PostMerkleTreeRequestBody } **/
  const validator = ajv.getSchema("SCHEMA#/definitions/PostMerkleTreeRequestBody");
  const valid = validator(payload);
  if (!valid) {
    const error = new Error('Invalid PostMerkleTreeRequestBody: ' + ajv.errorsText(validator.errors, {dataVar: "PostMerkleTreeRequestBody"}));
    error.name = "ValidationError";
    throw error;
  }
  return payload;
}

export function isPostMerkleTreeRequestBody(payload: unknown): payload is apiTypes.PostMerkleTreeRequestBody {
  try {
    validatePostMerkleTreeRequestBody(payload);
    return true;
  } catch (error) {
    return false;
  }
}

export function validatePostEncryptedAnswerDecryptionKeyRequestBody(payload: unknown): apiTypes.PostEncryptedAnswerDecryptionKeyRequestBody {
  /** Schema is defined in {@link SCHEMA.definitions.PostEncryptedAnswerDecryptionKeyRequestBody } **/
  const validator = ajv.getSchema("SCHEMA#/definitions/PostEncryptedAnswerDecryptionKeyRequestBody");
  const valid = validator(payload);
  if (!valid) {
    const error = new Error('Invalid PostEncryptedAnswerDecryptionKeyRequestBody: ' + ajv.errorsText(validator.errors, {dataVar: "PostEncryptedAnswerDecryptionKeyRequestBody"}));
    error.name = "ValidationError";
    throw error;
  }
  return payload;
}

export function isPostEncryptedAnswerDecryptionKeyRequestBody(payload: unknown): payload is apiTypes.PostEncryptedAnswerDecryptionKeyRequestBody {
  try {
    validatePostEncryptedAnswerDecryptionKeyRequestBody(payload);
    return true;
  } catch (error) {
    return false;
  }
}
