pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./Approvable.sol";

contract USDX is ERC20Mintable, ERC20Detailed, Ownable, Approvable {
    constructor()
    ERC20Detailed("Dextr. USD", "USDX", 18)
    public {}

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
