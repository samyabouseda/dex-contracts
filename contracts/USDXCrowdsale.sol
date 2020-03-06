pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";

contract USDXCrowdsale is Crowdsale, MintedCrowdsale {
    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet,
        IERC20 token
    )
    Crowdsale(rate, wallet, token)
    public
    {}
}
