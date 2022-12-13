import { FormCollectionCreated } from "../generated/FormCollectionFactory/FormCollectionFactory";
import { FormCollection } from "../generated/schema";

export function handleFormCollectionCreated(event: FormCollectionCreated): void {
  let collection = new FormCollection(event.params.newFormCollection);

  collection.contractAddress = event.params.newFormCollection;
  collection.owner = event.transaction.from;
  collection.name = event.params.name;
  collection.description = event.params.description;
  collection.closed = false;
  collection.createdAt = event.block.timestamp;

  collection.save();
}
