// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KesimpulanNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    event KesimpulanMinted(address indexed minter, uint256 indexed tokenId, string tokenURI);

    constructor(address initialOwner)
        ERC721("Kesimpulan Visual", "KSMPLN")
        Ownable(initialOwner)
    {}

    /// @notice Free mint, user hanya bayar gas
    function mint(string memory tokenURI_) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit KesimpulanMinted(msg.sender, tokenId, tokenURI_);
        return tokenId;
    }
}
