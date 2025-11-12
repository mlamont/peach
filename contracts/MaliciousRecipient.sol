// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract MaliciousRecipient {
    constructor() payable {}

    receive() external payable {
        revert("I reject your money!");
    }

    fallback() external payable {
        revert("I reject your money!");
    }
}
