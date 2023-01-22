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
        string memory _questions,
        bytes32 _merkleRoot,
        string memory _merkleTreeURI,
        string memory _answerEncryptionKey,
        string memory _encryptedAnswerDecryptionKey
    ) public {
        address clone = Clones.clone(baseFormCollection);
        FormCollection(clone).initialize(
            _name,
            _description,
            _questions,
            _merkleRoot,
            _merkleTreeURI,
            _answerEncryptionKey,
            _encryptedAnswerDecryptionKey,
            msg.sender
        );

        emit FormCollectionCreated(clone, _name, _description);

        formOwners[msg.sender].push(clone);
    }
}
