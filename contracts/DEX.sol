pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "./Approvable.sol";

contract DEX {

    event Deposit(address indexed depositor, address holder, address token, uint256 amount, uint rate);
    event TradeExecuted(
        address tokenMaker,
        address tokenTaker,
        uint256 amountMaker,
        uint256 amountTaker,
        address addressMaker,
        address addressTaker,
        uint256 nonce
    );

    struct Balance {
        address tokenAddress;
        uint tokenAmount;
    }

    struct Account {
        address _address;
        uint _totalOwnedInUSDX;
        mapping (address => Balance) _balances;
    }

    struct Trade {
        address tokenMaker;
        address tokenTaker;
        uint256 amountMaker;
        uint256 amountTaker;
        address addressMaker;
        address addressTaker;
        uint256 nonce;
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

    /**
     * @dev Returns the amount of a specific tokens owned by `_address`.
     */
    function tokenBalanceOf(address _address, address _token) public view returns (uint256) {
        Account storage account = accounts[_address];
        if (account._address == address(0)) {
            return 0;
        }
        Balance storage _balance = account._balances[_token];
        return _balance.tokenAmount;
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

        // calculate the amount owned in usdx for a token
        // the rate is received as an input to simplify the process.
        // However, it should be fetched directly on the crowdsale of a specific token.
        uint256 amountInUSDX = amount * rate;

        // update the total in usdx
        account._totalOwnedInUSDX += amountInUSDX;

        // transfer the tokens
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // emit deposit event
        emit Deposit(msg.sender, address(this), token, amount, rate);
    }

    function trade(
        address tokenMaker,
        address tokenTaker,
        uint256 amountMaker,
        uint256 amountTaker,
        address addressMaker,
        address addressTaker,
        uint256 nonce,
        bytes memory signature
    ) public {
        Trade memory trade = Trade(tokenMaker, tokenTaker, amountMaker, amountTaker, addressMaker, addressTaker, nonce);
//        require(msg.sender == _matchingEngine, "Sender: should be matching engine");
//        require(isValidSignature(trade, signature), "Trade: signature is invalid.");

        // Token exchange
        Account storage makerAccount = accounts[addressMaker];
        Account storage takerAccount = accounts[addressTaker];

        // NOTE: we suppose accounts are already registered
        Balance storage makerAccountBalanceOfTokenMaker = makerAccount._balances[tokenMaker]; // 1 -amountMaker
        Balance storage makerAccountBalanceOfTokenTaker = makerAccount._balances[tokenTaker]; // 1000  +amountTaker
        Balance storage takerAccountBalanceOfTokenMaker = takerAccount._balances[tokenMaker]; //  0 +amountTaker
        Balance storage takerAccountBalanceOfTokenTaker = takerAccount._balances[tokenTaker]; //  1000 -amountMaker


        makerAccountBalanceOfTokenMaker.tokenAmount -= amountMaker;
        makerAccountBalanceOfTokenTaker.tokenAmount += amountTaker;
        takerAccountBalanceOfTokenTaker.tokenAmount -= (amountMaker * 248); // 248 is the conversion rate AAPL/USDX
        takerAccountBalanceOfTokenMaker.tokenAmount += (amountTaker / 248); // 248 is the conversion rate AAPL/USDX

        emit TradeExecuted(
            trade.tokenMaker,
            trade.tokenTaker,
            trade.amountMaker,
            trade.amountTaker,
            trade.addressMaker,
            trade.addressTaker,
            trade.nonce
        );
    }
}
