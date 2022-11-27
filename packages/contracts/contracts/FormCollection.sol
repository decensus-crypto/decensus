// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Base64} from "./Base64.sol";

contract FormCollection is
    Initializable,
    ERC721Upgradeable,
    OwnableUpgradeable
{
    bytes32 public merkleRoot;
    string public description;
    string public formDataURI;
    string public answerEncryptionKey;
    string public answerDecryptionKeyURI;
    bool public closed;

    mapping(address => string) public encryptedAnswers;
    uint256 public numberOfAnswers;

    event AnswerSubmitted(
        address respondent,
        string encryptedAnswer,
        uint256 tokenId
    );

    event Closed();

    function initialize(
        string memory _name,
        string memory _description,
        bytes32 _merkleRoot,
        string memory _formDataURI,
        string memory _answerEncryptionKey,
        string memory _answerDecryptionKeyURI,
        address _owner
    ) external initializer {
        __ERC721_init(_name, "DCS");
        _transferOwnership(_owner);
        description = _description;
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
            require(
                MerkleProof.verify(_merkleProof, merkleRoot, leaf),
                "Invalid Merkle proof."
            );
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
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name(),
                        '", "description": "',
                        description,
                        // TODO: fix domain
                        '", "external_link": "https://phorms.xyz"}'
                    )
                )
            )
        );

        string memory finalContractUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return finalContractUri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token does not exist.");

        string memory newSvg = string(
            abi.encodePacked(
                '<svg viewBox="0 0 180 180" style="font-family:monospace"><rect width="100%" height="100%"/><path d="M20 0v180M0 20h180" style="stroke:gray"/><text x="23" y="15" style="font-size:6px" fill="#fff">',
                name(),
                '</text><text text-anchor="middle" x="50%" y="40%" fill="#fff" style="font-size:10px">Answer #',
                Strings.toString(tokenId),
                '</text><text text-anchor="middle" x="50%" y="60%" fill="#fff" style="font-size:16px"><tspan fill="#FC8CC9">de</tspan>census</text></svg>'
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name(),
                        '", "description": "',
                        description,
                        '", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(newSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return finalTokenUri;
    }

    /// @notice ERC721 _transfer() Disabled
    /// @dev _transfer() has been overriden
    /// @dev reverts on transferFrom() and safeTransferFrom()
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(!true, "ERC721: token transfer disabled");
        super._transfer(from, to, tokenId);
    }
}
