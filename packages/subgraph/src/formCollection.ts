import { BigInt, ByteArray } from "@graphprotocol/graph-ts";
import { AnswerSubmitted } from "../generated/FormCollection/FormCollection";
import { Answer } from "../generated/schema";

export function handleAnswerSubmitted(event: AnswerSubmitted): void {
  let answer = new Answer(
    ByteArray.fromBigInt(
      BigInt.fromUnsignedBytes(event.address).plus(event.params.tokenId)
    )
  );

  answer.encryptedAnswer = event.params.encryptedAnswer;
  answer.contractAddress = event.address;
  answer.respondentAddress = event.params.respondent;
  answer.mintedTokenId = event.params.tokenId;

  answer.save();
}
