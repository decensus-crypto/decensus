import { newMockEvent } from "matchstick-as";
import { ethereum, Address } from "@graphprotocol/graph-ts";
import { FormCollectionCreated, OwnershipTransferred } from "../generated/Contract/Contract";

export function createFormCollectionCreatedEvent(
  newFormCollection: Address,
): FormCollectionCreated {
  let formCollectionCreatedEvent = changetype<FormCollectionCreated>(newMockEvent());

  formCollectionCreatedEvent.parameters = new Array();

  formCollectionCreatedEvent.parameters.push(
    new ethereum.EventParam("newFormCollection", ethereum.Value.fromAddress(newFormCollection)),
  );

  return formCollectionCreatedEvent;
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address,
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(newMockEvent());

  ownershipTransferredEvent.parameters = new Array();

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("previousOwner", ethereum.Value.fromAddress(previousOwner)),
  );
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner)),
  );

  return ownershipTransferredEvent;
}
