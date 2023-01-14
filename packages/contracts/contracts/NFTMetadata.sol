// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Base64} from "./Base64.sol";

library NFTMetadata {
    string constant DECENSUS_URL = "https://decensus.centiv.xyz";

    function generateContractURI(
        string memory formName,
        string memory formDescription
    ) internal pure returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        formName,
                        '", "description": "',
                        formDescription,
                        '", "external_link": "',
                        DECENSUS_URL,
                        '"}'
                    )
                )
            )
        );

        string memory contractUri = string(abi.encodePacked("data:application/json;base64,", json));

        return contractUri;
    }

    function generateTokenURI(
        string memory collectionImageURI,
        string memory formName,
        string memory formDescription,
        uint256 tokenId,
        address respondent
    ) internal pure returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        formName,
                        ": Answer #",
                        Strings.toString(tokenId),
                        '", "description": "',
                        formDescription,
                        '", "image": "',
                        _generateAnswerImage(collectionImageURI, formName, tokenId, respondent),
                        '"}'
                    )
                )
            )
        );

        string memory tokenUri = string(abi.encodePacked("data:application/json;base64,", json));

        return tokenUri;
    }

    function _generateAnswerImage(
        string memory collectionImageURI,
        string memory formName,
        uint256 tokenId,
        address respondent
    ) internal pure returns (string memory) {
        string memory svg = string(
            abi.encodePacked(
                '<svg width="290" height="500" viewBox="0 0 290 500" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0" stop-color="#FC8CC9"><animate attributeName="stop-color" values="#FC8CC9;#3C1329;#000000;#3C1329;#FC8CC9;" dur="12s" repeatCount="indefinite"/></stop><stop offset=".5" stop-color="#3C1329"><animate attributeName="stop-color" values="#3C1329;#000000;#3C1329;#FC8CC9;#3C1329;" dur="12s" repeatCount="indefinite"/></stop><stop offset="1"><animate attributeName="stop-color" values="#000000;#3C1329;#FC8CC9;#3C1329;#000000;" dur="12s" repeatCount="indefinite"/></stop><animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="12s" repeatCount="indefinite"/></linearGradient></defs><rect fill="url(#a)" width="290" height="500" rx="24"/><image href="',
                collectionImageURI,
                '" opacity=".25" y="105" width="290" height="290"/><text font-family="apercu-pro, -apple-system, BlinkMacSystemFont, \'Helvetica Neue\', sans-serif" font-size="36" font-weight="300" fill="#FFF">',
                '<tspan x="24" y="80">',
                formName,
                '</tspan></text><text font-family="apercu-pro, -apple-system, BlinkMacSystemFont, \'Helvetica Neue\', sans-serif" font-size="14" font-weight="300" fill="#DDD">',
                '<tspan x="24" y="102">Answer #',
                Strings.toString(tokenId),
                '</tspan></text><path d="M0 464h290" id="b"/><text text-anchor="middle">',
                '<textPath href="#b" stroke="#DDD" fill="#fff" font-family="monospace" font-size="12">',
                Strings.toHexString(uint256(uint160(respondent)), 20),
                '<animate additive="sum" attributeName="startOffset" from="170%" to="-70%" begin="0s" dur="4s" repeatCount="indefinite"/></textPath></text>',
                '<path d="M258.337 440c-1.2 0-2.006-.286-2.421-.859-.415-.573-.623-1.336-.623-2.29 0-.799.332-1.198.996-1.198.664 0 .996.373.996 1.12 0 .52.083.876.25 1.066.165.191.497.287.995.287h7.415c.904 0 1.356-.52 1.356-1.562 0-.503-.124-.924-.374-1.262-.249-.339-.576-.508-.982-.508h-6.806c-1.328 0-2.301-.321-2.919-.963-.618-.642-.927-1.484-.927-2.525 0-1.076.341-1.896 1.024-2.46.682-.564 1.9-.846 3.652-.846h6.225c1.2 0 2.006.29 2.421.872.415.581.623 1.35.623 2.304 0 .78-.332 1.171-.996 1.171-.259 0-.49-.087-.692-.26-.203-.174-.304-.46-.304-.86 0-.52-.083-.876-.25-1.066-.165-.191-.497-.287-.995-.287h-7.36c-.904 0-1.356.477-1.356 1.432 0 .52.13.92.388 1.197.258.278.58.417.968.417h6.834c1.365 0 2.342.347 2.933 1.041.59.694.885 1.562.885 2.603 0 1.11-.346 1.96-1.037 2.551-.692.59-1.896.885-3.611.885h-6.308Z" fill="#FFF"/></svg>'
            )
        );

        string memory svgBase64Encoded = Base64.encode(bytes(svg));

        return string(abi.encodePacked("data:image/svg+xml;base64,", svgBase64Encoded));
    }
}
