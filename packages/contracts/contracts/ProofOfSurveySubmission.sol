//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract DecensusProofOfSurveySubmission is EIP712, Ownable {
    mapping(address => mapping(string => bool)) public proofs;

    constructor() EIP712("DecensusProofOfSurveySubmission", "0.0.1") {}

    function addProof(
        address account,
        string calldata surveyId,
        bytes calldata signature
    ) public {
        // check signature
        require(
            _verify(_hash(account, surveyId), signature),
            "Invalid signature"
        );
        console.log(account, "valid signature");

        // updateProof (idempotent)
        proofs[account][surveyId] = true;
        console.log(account, surveyId, "proof updated");
    }

    function hasProof(address account, string calldata surveyId)
        public
        view
        returns (bool)
    {
        return proofs[account][surveyId];
    }

    function _hash(address account, string calldata surveyId)
        internal
        view
        returns (bytes32)
    {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "SubmittedSurvey(address account,string surveyId)"
                        ),
                        account,
                        keccak256(bytes(surveyId))
                    )
                )
            );
    }

    function _verify(bytes32 digest, bytes calldata signature)
        internal
        view
        returns (bool)
    {
        return owner() == ECDSA.recover(digest, signature);
    }
}
