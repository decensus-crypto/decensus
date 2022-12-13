import { AnswerSubmitted, Closed } from "../generated/FormCollection/FormCollection";
import { Answer, FormCollection } from "../generated/schema";

export function handleAnswerSubmitted(event: AnswerSubmitted): void {
  let answer = new Answer(`${event.address.toHexString()}${event.params.tokenId.toString()}`);

  answer.encryptedAnswer = event.params.encryptedAnswer;
  answer.contractAddress = event.address;
  answer.respondentAddress = event.params.respondent;
  answer.mintedTokenId = event.params.tokenId;

  answer.save();
}

export function handleClosed(event: Closed): void {
  let id = event.address;
  let collection = FormCollection.load(id);
  if (collection == null) {
    return;
  }

  collection.closed = true;
  collection.save();
}
