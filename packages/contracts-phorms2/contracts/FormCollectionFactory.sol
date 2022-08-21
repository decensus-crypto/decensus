// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./FormCollection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract FormCollectionFactory is Ownable {
    address public baseFormCollection;

    mapping(address => address[]) public formOwners;

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
        bytes32 _merkleRoot,
        string memory _formDataId,
        string memory _merkleTreeId,
        string memory _answerEncryptionPublicKey
    ) public {
        address clone = Clones.clone(baseFormCollection);
        FormCollection(clone).initialize(
            _name,
            _description,
            _merkleRoot,
            _formDataId,
            _merkleTreeId,
            _answerEncryptionPublicKey,
            msg.sender
        );

        emit FormCollectionCreated(clone);

        formOwners[msg.sender].push(clone);
    }
}
