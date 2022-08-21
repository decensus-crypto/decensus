// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./FormCollection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract FormCollectionFactory is Ownable {
    // struct formCollectionAddress {
    //     address formOwner;
    // }

    address public baseFormCollection;
    // mapping(address => formCollectionAddress[] ) public formOwners;

    mapping(address => address[]) public formOwners;

    // struct ContractAddresses {
    //     address[] addresess;
    // };

    // mapping(address => ContractAddresses ) public formOwners;

    event FormCollectionCreated(address newFormCollection);

    constructor() {
        baseFormCollection = address(new FormCollection());
    }

    function setBaseFormCollection(address _baseFormCollection)
        public
        onlyOwner
    {
        baseFormCollection = _baseFormCollection;
    }

    function createFormCollection(
        string memory _name,
        string memory _description,
        string memory _questions,
        bytes32 _merkleRoot,
        string memory _merkleTreeURL
    )
        public
        returns (
            // bytes calldata _ownerPubKey
            address instance
        )
    {
        address clone = Clones.clone(baseFormCollection);
        FormCollection(clone).initialize(
            _name,
            _description,
            _questions,
            _merkleRoot,
            // _ownerPubKey, // TODO
            _merkleTreeURL,
            msg.sender
        );

        emit FormCollectionCreated(clone);

        formOwners[msg.sender].push(clone);

        return instance;
    }
}
