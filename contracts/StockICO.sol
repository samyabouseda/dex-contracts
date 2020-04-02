pragma solidity ^0.5.2;

import "./Stock.sol";
import "./USDX.sol";

contract StockICO {
    address public owner;
    Stock public stockToken;
    USDX public fiatToken;
    uint8 public pricePerShare;

    event StockPurchase(address indexed buyer, address stockToken, uint256 numberOfShares, uint sharePrice);

    constructor(Stock _stockToken, USDX _fiatToken, uint8 _pricePerShare) public {
        owner = msg.sender;
        stockToken = _stockToken;
        fiatToken = _fiatToken;
        pricePerShare = _pricePerShare;
    }

    function stock() public view returns (Stock) {
        return stockToken;
    }

    function buy(uint numberOfShares, uint sharePrice) public {
        require(fiatToken.balanceOf(msg.sender) > 0, "StockICO: Sender balance can't be 0");
        require(numberOfShares > 0, "StockICO: Number of shares can't be 0");

        // calculate the amount owned in usdx for a token
        // the rate is received as an input to simplify the process.
        // However, it should be fetched directly on the crowdsale of a specific token.
        uint256 amountInUSDX = numberOfShares * sharePrice;

        fiatToken.approveFrom(msg.sender, address(this), amountInUSDX);
        fiatToken.transferFrom(msg.sender, address(this), amountInUSDX);
        stockToken.transfer(msg.sender, numberOfShares);

        emit StockPurchase(msg.sender, address(stockToken), numberOfShares, sharePrice);
    }
}
