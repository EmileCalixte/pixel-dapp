// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract PixelPic is ERC165, IERC721 {
    function supportsInterface(bytes4 interfaceId) public view virtual override returns(bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function balanceOf(address owner) external view returns (uint256 balance) {
        return 0; // TODO
    }

    function ownerOf(uint256 tokenId) external view returns (address owner) {
        return address(0); // TODO
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external {

    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external {

    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external {

    }

    function approve(address to, uint256 tokenId) external {

    }

    function setApprovalForAll(address operator, bool _approved) external {

    }

    function getApproved(uint256 tokenId) external view returns (address operator) {
        return address(0); // TODO
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return false; // TODO
    }
}
