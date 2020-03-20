pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "./Approvable.sol";

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

    function deposit(address token, uint amount, uint rate) public {
        require(amount > 0, "DEX: amount deposited is 0");
        Approvable(token).approveFrom(msg.sender, address(this), amount);

        // check if user has enough token
        uint balance = ERC20Detailed(token).balanceOf(msg.sender);
        require(balance >= amount, "DEX: Sender doesn't have enough fund to make this deposit.");

        // calc and update new balance
        Account storage account = accounts[msg.sender];
        if (account._address == address(msg.sender)) { // if account is registered
            Balance storage _balance = account._balances[token];
            _balance.tokenAmount += amount;
        } else { // account is not registered
            account._address = msg.sender;
            Balance memory newBalance = Balance(token, amount);
            account._balances[token] = newBalance;
        }

        // calc amount * rate to get usdx amount
        // the rate is received as an input to simplify the process.
        // However, it should be fetched directly on the crowdsale of a specific token.
        uint256 amountInUSDX = amount * rate;

        // update the total in usdx
        account._totalOwnedInUSDX += amountInUSDX;

        // transfer the tokens
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // emit deposit event
        emit Deposit("Dextr. USD");
    }
}
