pragma solidity ^0.5.0;

contract DEX {

    event Deposit();

    struct Balance {
        address tokenAddress;
        uint tokenAmount;
    }

    struct Account {
        address account;
        uint totalOwnedInUSDX;
        mapping (address => Balance) balances;
    }

    mapping (address => Account) accounts;

    /**
     * @dev Returns the amount of tokens owned by `account`expressed in USDX.
     */
    function balanceOf(address account) public view returns (uint256) {
        return 0;
    }

    function deposit() public {
        // check if user has enough token

        // calc and update new total in usdx

        // transfer token from sender account to dex account

        // emit deposit event
    }
}
