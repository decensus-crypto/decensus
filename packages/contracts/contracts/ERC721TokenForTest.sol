//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721TokenForTest is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Test", "TST") {}

    function mint(address account) public {
        uint256 tokenId = _tokenIds.current();
        _mint(account, tokenId);
        _tokenIds.increment();
    }
}
