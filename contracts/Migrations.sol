pragma solidity >=0.4.25 <0.7.0;

/*
 * This is a separate Solidity file that manages and updates the status of the deployed smart contracts.
 * This file comes with every Truffle project, and is usually not edited.
 */
contract Migrations {
  address public owner;
  uint public last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}
