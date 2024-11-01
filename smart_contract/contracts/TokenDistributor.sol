// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenDistributor is ERC20 {
    address public owner;

    constructor() ERC20("HelpNetToken", "HNT") {
        owner = msg.sender;
        _mint(owner, 1000000 * 10 ** decimals()); // Mint 1,000,000 tokens to the owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function distributeTokens(address recipient, uint256 amount) public onlyOwner {
        require(balanceOf(owner) >= amount, "Insufficient balance");
        _transfer(owner, recipient, amount); // Transfer tokens to the recipient
    }
}
