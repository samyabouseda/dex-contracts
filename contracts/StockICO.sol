pragma solidity ^0.5.2;

import "./Stock.sol";
import "./USDX.sol";

contract StockICO {
    address public owner;
    Stock public stockToken;
    USDX public fiatToken;
    uint8 public pricePerShare;

    constructor(Stock _stockToken, USDX _fiatToken, uint8 _pricePerShare) public {
        owner = msg.sender;
        stockToken = _stockToken;
        fiatToken = _fiatToken;
        pricePerShare = _pricePerShare;
    }

    function stock() public view returns (Stock) {
        return stockToken;
    }
}
