pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract USDX is ERC20Mintable, ERC20Detailed {
    constructor()
    ERC20Detailed("Dextr. USD", "USDX", 2)
    public {}
}
