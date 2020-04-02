pragma solidity ^0.5.2;

import "./Approvable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stock is ERC20, Ownable, ERC20Detailed, Approvable {

    constructor(string memory name, string memory symbol, uint8 decimals, uint256 initialSupply)
        ERC20Detailed(name, symbol, decimals)
        public
    {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `sender`'s tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits an `Approval` event.
     */
    function approveFrom(address sender, address spender, uint256 value) public returns (bool) {
        _approve(sender, spender, value);
        return true;
    }
}
