import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { Address } from "@graphprotocol/graph-ts";
import { ExampleEntity } from "../generated/schema";
import { FormCollectionCreated } from "../generated/Contract/Contract";
import { handleFormCollectionCreated } from "../src/contract";
import { createFormCollectionCreatedEvent } from "./contract-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newFormCollection = Address.fromString("0x0000000000000000000000000000000000000001");
    let newFormCollectionCreatedEvent = createFormCollectionCreatedEvent(newFormCollection);
    handleFormCollectionCreated(newFormCollectionCreatedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ExampleEntity created and stored", () => {
    assert.entityCount("ExampleEntity", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ExampleEntity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "newFormCollection",
      "0x0000000000000000000000000000000000000001",
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});
