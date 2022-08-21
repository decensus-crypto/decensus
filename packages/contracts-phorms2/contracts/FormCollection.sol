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
    string public description;
    string public questions;
    bytes32 public merkleRoot;
    string public merkleTreeURL;
    //bytes public ownerPubKey;
    mapping(address => string) public answers;
    uint256 public numberOfAnswers;

    event AnswerSubmitted(address respondent, string answers);

    function initialize(
        string memory name_,
        string memory _description,
        string memory _questions, // base64 encoded
        bytes32 _merkleRoot,
        string memory _merkleTreeURL,
        // bytes calldata _ownerPubKey, // TODO: private answers option encrypted with owner and responder public keys
        address _owner
    ) public initializer {
        __ERC721_init(name_, "PH");
        _transferOwnership(_owner);
        description = _description;
        questions = _questions;
        merkleRoot = _merkleRoot;
        merkleTreeURL = _merkleTreeURL;
        // ownerPubKey = _ownerPubKey;
    }

    function submitAnswers(
        bytes32[] calldata _merkleProof,
        string calldata _answers
    ) public {
        // require(
        //     answers.length == questions.length,
        //     "Number of answers must be the same as number of questions."
        // ); // front-end has to check this now

        require(
            bytes(answers[msg.sender]).length == 0,
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
        answers[msg.sender] = _answers;

        numberOfAnswers++;

        emit AnswerSubmitted(msg.sender, _answers);
    }

    function contractURI() public view returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name(),
                        ' - by phorms.xyz", "description": "',
                        description,
                        '", "image": "https://raw.githubusercontent.com/eherrerosj/baskelo-tercko-420/main/assets/logo.png?token=GHSAT0AAAAAABOQL73VPNCSX2JT75W3YWUYYVWWOBA", ',
                        '"external_link": "https://phorms.xyz"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return finalTokenUri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Token does not exist.");
        // return string(abi.encodePacked(baseURI, Strings.toString(tokenId)));

        string memory newSvg = string(
            abi.encodePacked(
                '<svg viewBox="0 0 360 360"><path d="M20 10v310M10 40h310M10 80" style="stroke:gray"/><text x="30" y="30" style="font-family:Avenir,Helvetica,sans-serif;font-size:15px;font-weight:700;text-transform:uppercase">',
                name(),
                '</text><foreignObject x="20" y="60" width="300" height="360"><p xmlns="http://www.w3.org/1999/xhtml" style="font-family:Avenir,Helvetica,sans-serif;font-size:8px">',
                Base64.decode(answers[ownerOf(tokenId)]),
                '</p></foreignObject><linearGradient id="a" x1="0" y1="0" x2="100%" y2="100%"><stop stop-color="hsl(245.6, 85.78%, 44.12%)" offset="10%"/><stop stop-color="hsl(125.64, 86.32%, 54.12%)" offset="90%"/></linearGradient><text text-anchor="middle" x="50%" y="80%" dy=".35em" class="text" fill="url(#a)">phorms.xyz</text></svg>'
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name(),
                        ' - by phorms.xyz", "description": "',
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
