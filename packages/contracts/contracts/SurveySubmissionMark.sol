//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

contract DecensusSurveySubmissionMark {
    using ERC165Checker for address;

    bytes4 public constant IID_IERC721 = type(IERC721).interfaceId;
    mapping(string => address) public surveys;
    mapping(address => string[]) public surveyOwners;
    mapping(address => mapping(string => bool)) public submissionMarks;

    constructor() {}

    function addSurvey(string calldata surveyId, address nftAddress) public {
        // check if address implements ERC721, and the survey owner holds NFT
        require(
            nftAddress.supportsInterface(IID_IERC721),
            "NFT contract does not support ERC721"
        );
        require(
            _checkBalanceOfNft(nftAddress, msg.sender) > 0,
            "survey owner must hold NFT"
        );

        surveys[surveyId] = nftAddress;
        surveyOwners[msg.sender].push(surveyId);
    }

    function addMark(string calldata surveyId) public {
        address nftAddress = surveys[surveyId];

        // check if survey exists, and the survey submitter holds NFT
        require(nftAddress != address(0), "survey does not exist");
        require(
            _checkBalanceOfNft(nftAddress, msg.sender) > 0,
            "survey submitter must hold NFT"
        );

        // updateMark (idempotent)
        submissionMarks[msg.sender][surveyId] = true;
    }

    function hasMark(address account, string calldata surveyId)
        public
        view
        returns (bool)
    {
        return submissionMarks[account][surveyId];
    }

    function mySurveys() public view returns (string[] memory) {
        return surveyOwners[msg.sender];
    }

    function _checkBalanceOfNft(address nftAddress, address account)
        internal
        returns (uint256 value)
    {
        (bool success, bytes memory data) = nftAddress.call(
            abi.encodeWithSignature("balanceOf(address)", account)
        );
        require(success, "invalid NFT contract");

        return _toUint256(data);
    }

    function _toUint256(bytes memory _bytes)
        internal
        pure
        returns (uint256 value)
    {
        assembly {
            value := mload(add(_bytes, 0x20))
        }
    }
}
