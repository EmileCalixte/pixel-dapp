// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PixelCoin is IERC20 {
    address private founder;

    string public name = "PixelCoin";
    string public symbol = "PIXC";
    uint public decimals = 18;
    uint public totalSupply = 100000000000000000000000000;

    mapping(address => uint256) private balances;

    mapping(address => mapping(address => uint256)) private allowances;

    constructor() {
        founder = msg.sender;
        balances[founder] = totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256 balance) {
        return balances[account];
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        require(balances[msg.sender] >= amount, "Transfer amount exceeds balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);

        return true;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        allowances[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);

        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        require(allowances[from][msg.sender] >= amount, "Transfer amount exceeds allowance");
        require(balances[from] >= amount, "Transfer amount exceeds balance");

        balances[from] -= amount;
        allowances[from][msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(from, to, amount);

        return true;
    }
}
