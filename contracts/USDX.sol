pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract USDX is ERC20Mintable, ERC20Detailed, Ownable {
    constructor()
    ERC20Detailed("Dextr. USD", "USDX", 18)
    public {}
}
