pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract DEX {

    event Deposit(bytes32 indexed hello);

    struct Balance {
        address tokenAddress;
        uint tokenAmount;
    }

    struct Account {
        address _address;
        uint _totalOwnedInUSDX;
        mapping (address => Balance) _balances;
    }

    mapping (address => Account) accounts;

    /**
     * @dev Returns the amount of tokens owned by `_address`expressed in USDX.
     */
    function balanceOf(address _address) public view returns (uint256) {
        Account memory account = accounts[_address];
        if (account._address == address(0)) {
            return 0;
        }
        return account._totalOwnedInUSDX;
    }

    event E (uint indexed a);
    function deposit(address tokenAddress, uint amount) public {
        require(amount > 0, "DEX: amount deposited is 0");

        // check if user has enough token
        uint balance = ERC20Detailed(tokenAddress).balanceOf(msg.sender);
        require(balance >= amount, "DEX: Sender doesn't have enough fund to deposit.");

        // calc and update new total in usdx
        Account memory account = accounts[msg.sender];
        if (account._address == address(msg.sender)) {
            // get rate of tokenAddress
            // calc new usdx total
            // update token amount in balances
            // transfer token from sender account to dex account
            // emit deposit event
        } else {
            Account memory newAccount = Account(msg.sender, 0);

            // get rate of token
            // calc amount * rate to get usdx amount
            // add new balance for the tokenAddress

            newAccount._totalOwnedInUSDX += amount;
        }
        emit E(balance);

        // emit deposit event
        emit Deposit("Dextr. USD");
    }
}
