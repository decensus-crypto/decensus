// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {NFTMetadata} from "./NFTMetadata.sol";

contract FormCollection is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    bytes32 public merkleRoot;
    string public description;
    string public collectionImageURI;
    string public formDataURI;
    string public answerEncryptionKey;
    string public answerDecryptionKeyURI;
    bool public closed;

    mapping(address => string) public encryptedAnswers;
    uint256 public numberOfAnswers;

    event AnswerSubmitted(address respondent, string encryptedAnswer, uint256 tokenId);

    event Closed();

    function initialize(
        string memory _name,
        string memory _description,
        string memory _collectionImageURI,
        bytes32 _merkleRoot,
        string memory _formDataURI,
        string memory _answerEncryptionKey,
        string memory _answerDecryptionKeyURI,
        address _owner
    ) external initializer {
        __ERC721_init(_name, "DCS");
        _transferOwnership(_owner);
        description = _description;
        collectionImageURI = _collectionImageURI;
        merkleRoot = _merkleRoot;
        formDataURI = _formDataURI;
        answerEncryptionKey = _answerEncryptionKey;
        answerDecryptionKeyURI = _answerDecryptionKeyURI;
    }

    function submitAnswers(
        bytes32[] calldata _merkleProof,
        string calldata _encryptedAnswer
    ) external {
        require(!closed, "Survey closed");
        require(
            bytes(encryptedAnswers[msg.sender]).length == 0,
            "Forms can only be filled in once per address."
        );

        // only check proof if form is token gated
        if (merkleRoot.length != 0) {
            bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
            require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Invalid Merkle proof.");
        }

        _safeMint(msg.sender, numberOfAnswers);
        encryptedAnswers[msg.sender] = _encryptedAnswer;

        emit AnswerSubmitted(msg.sender, _encryptedAnswer, numberOfAnswers);

        numberOfAnswers++;
    }

    function close() external onlyOwner {
        closed = true;
        emit Closed();
    }

    function contractURI() external view returns (string memory) {
        return NFTMetadata.generateContractURI(name(), description);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist.");

        return
            NFTMetadata.generateTokenURI(
                collectionImageURI,
                name(),
                description,
                tokenId,
                ownerOf(tokenId)
            );
    }

    /// @notice ERC721 _transfer() Disabled
    /// @dev _transfer() has been overriden
    /// @dev reverts on transferFrom() and safeTransferFrom()
    function _transfer(address from, address to, uint256 tokenId) internal override {
        require(!true, "ERC721: token transfer disabled");
        super._transfer(from, to, tokenId);
    }
}
