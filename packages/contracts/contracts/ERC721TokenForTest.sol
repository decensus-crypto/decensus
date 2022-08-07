//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721TokenForTest is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint256[]) holderTokenIdMap;

    constructor() ERC721("Test", "TST") {}

    function mint(address account) public {
        uint256 tokenId = _tokenIds.current();
        _mint(account, tokenId);
        holderTokenIdMap[account].push(tokenId);

        _tokenIds.increment();
    }

    function burnAllHoldingTokens(address account) public {
        uint256[] memory tokenIds = holderTokenIdMap[account];

        for (uint256 i = 0; i < tokenIds.length; i++) {
            _burn(tokenIds[i]);
        }
    }
}
