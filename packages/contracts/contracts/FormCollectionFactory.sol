// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./FormCollection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract FormCollectionFactory is Ownable {
    address public baseFormCollection;

    mapping(address => address[]) public formOwners;

    event FormCollectionCreated(address newFormCollection, string name, string description);

    constructor() {
        baseFormCollection = address(new FormCollection());
    }

    function setBaseFormCollection(address _baseFormCollection) public onlyOwner {
        baseFormCollection = _baseFormCollection;
    }

    function createFormCollection(
        string memory _name,
        string memory _description,
        string memory _collectionImageURI,
        bytes32 _merkleRoot,
        string memory _formDataURI,
        string memory _answerEncryptionKey,
        string memory _answerDecryptionKeyURI
    ) public {
        address clone = Clones.clone(baseFormCollection);
        FormCollection(clone).initialize(
            _name,
            _description,
            _collectionImageURI,
            _merkleRoot,
            _formDataURI,
            _answerEncryptionKey,
            _answerDecryptionKeyURI,
            msg.sender
        );

        emit FormCollectionCreated(clone, _name, _description);

        formOwners[msg.sender].push(clone);
    }
}
