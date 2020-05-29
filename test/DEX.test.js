const { expect } = require('chai')
const _beforeEach = require('./before-each')
const abi = require('ethereumjs-abi')

contract('DEX', accounts => {
	beforeEach(async () => {
		this.contracts = await _beforeEach(accounts)
		this.account = accounts[1]

		// Purchase USDX from first account
		await this.contracts.fiatCrowdsale.sendTransaction({
			value: 10,
			from: accounts[1],
		})
	})

	it('account 1 should have 231 usdx', async () => {
		const { fiat } = this.contracts
		const accountOneBalance = (
			await fiat.balanceOf(accounts[1])
		).toNumber()
		expect(accountOneBalance).to.equal(2310)
	})

	it('should allow user to deposit USDX tokens', async () => {
		const { fiat, dex } = this.contracts
		const accountOne = accounts[1]

		// Get initial balance of first account.
		const accountOneStartingBalance = (
			await fiat.balanceOf(accountOne)
		).toNumber()
		const accountOneStartingBalanceOnDex = (
			await dex.balanceOf(accountOne)
		).toNumber()

		// Deposit USDX on DEX smart contract.
		await dex.deposit(fiat.address, 100, 1, {
			from: accountOne,
		})

		// Get balance after first transaction.
		const accountOneEndingBalance = (
			await fiat.balanceOf(accountOne)
		).toNumber()
		const accountOneEndingBalanceOnDex = (
			await dex.balanceOf(accountOne)
		).toNumber()

		expect(accountOneStartingBalance).to.equal(2310)
		expect(accountOneStartingBalanceOnDex).to.equal(0)
		expect(accountOneEndingBalance).to.equal(2210)
		expect(accountOneEndingBalanceOnDex).to.equal(100)
	})

	it('should allow user to deposit USDX tokens multiple times', async () => {
		const { fiat, dex } = this.contracts
		const accountOne = accounts[1]

		// Get initial balance of first account.
		const accountOneStartingBalance = (
			await fiat.balanceOf(accountOne)
		).toNumber()
		const accountOneStartingBalanceOnDex = (
			await dex.balanceOf(accountOne)
		).toNumber()

		// Deposit USDX on DEX smart contract.
		await dex.deposit(fiat.address, 100, 1, {
			from: accountOne,
		})
		await dex.deposit(fiat.address, 27, 1, {
			from: accountOne,
		})

		// Get balance after last transaction.
		const accountOneEndingBalance = (
			await fiat.balanceOf(accountOne)
		).toNumber()
		const accountOneEndingBalanceOnDex = (
			await dex.balanceOf(accountOne)
		).toNumber()

		expect(accountOneStartingBalance).to.equal(2310)
		expect(accountOneStartingBalanceOnDex).to.equal(0)
		expect(accountOneEndingBalance).to.equal(2183)
		expect(accountOneEndingBalanceOnDex).to.equal(127)
	})

	it('should allow user to deposit stock tokens', async () => {
		// check that balanceOf specific token is equal to the amount sent.
		const { stock, stockIco, fiat, dex } = this.contracts

		// Stock purchase
		const numberOfShares = 1
		const rate = 248
		await stockIco.buy(numberOfShares, rate, {
			from: this.account,
		})

		// Get initial balance of first account.
		const accountOneStartingBalance = (
			await stock.balanceOf(this.account)
		).toNumber()
		const accountOneStartingBalanceOnDex = (
			await dex.balanceOf(this.account)
		).toNumber()

		// Deposit Stock on DEX smart contract.
		await dex.deposit(stock.address, numberOfShares, rate, {
			from: this.account,
		})

		// Get balance after last transaction.
		const accountOneEndingBalance = (
			await stock.balanceOf(this.account)
		).toNumber()
		const accountOneEndingBalanceOnDex = (
			await dex.balanceOf(this.account)
		).toNumber()

		expect(accountOneStartingBalance).to.equal(1)
		expect(accountOneStartingBalanceOnDex).to.equal(0)
		expect(accountOneEndingBalance).to.equal(0)
		expect(accountOneEndingBalanceOnDex).to.equal(248)
	})

	it('should allow matching engine to place a trade', async () => {
		const { stock, stockIco, fiat, dex } = this.contracts

		// initMakerAccount
		const maker = accounts[3]
		const makerPrivateKey =
			'7d4062be49dc548140f2ac7f6fe1921493123a48e7728b9171f35db0c30e5c84'
		// USDX purchase
		await this.contracts.fiatCrowdsale.sendTransaction({
			value: 1000,
			from: maker,
		})
		// Stock purchase
		const numberOfShares = 1
		const rate = 248
		await stockIco.buy(numberOfShares, rate, {
			from: maker,
		})
		// Deposits
		await dex.deposit(fiat.address, 1000, 1, {
			from: maker,
		})
		await dex.deposit(stock.address, 1, rate, {
			from: maker,
		})

		// initTakerAccount
		const taker = accounts[4]
		const takerPrivateKey =
			'e2a713f62e0e2e034b14771779d9fad0035318cb22f5fed28be96709ace00ebf'
		await this.contracts.fiatCrowdsale.sendTransaction({
			value: 1000,
			from: taker,
		})
		// USDX deposit
		await dex.deposit(fiat.address, 1000, 1, {
			from: taker,
		})
		// placeTakerOrder

		const makerStartingBalanceOnDex = (
			await dex.balanceOf(maker)
		).toNumber()
		const takerStartingBalanceOnDex = (
			await dex.balanceOf(taker)
		).toNumber()
		const makerStartingUSDXBalanceOnDex = (
			await dex.tokenBalanceOf(maker, fiat.address)
		).toNumber()
		const makerStartingStockBalanceOnDex = (
			await dex.tokenBalanceOf(maker, stock.address)
		).toNumber()
		const takerStartingUSDXBalanceOnDex = (
			await dex.tokenBalanceOf(taker, fiat.address)
		).toNumber()
		const takerStartingStockBalanceOnDex = (
			await dex.tokenBalanceOf(taker, stock.address)
		).toNumber()

		expect(makerStartingBalanceOnDex).to.equal(1248)
		expect(makerStartingUSDXBalanceOnDex).to.equal(1000)
		expect(makerStartingStockBalanceOnDex).to.equal(1)

		expect(takerStartingBalanceOnDex).to.equal(1000)
		expect(takerStartingUSDXBalanceOnDex).to.equal(1000)
		expect(takerStartingStockBalanceOnDex).to.equal(0)

		const tokenMaker = stock.address
		const tokenTaker = fiat.address
		const amountMaker = 1
		const amountTaker = 248
		const addressMaker = maker
		const addressTaker = taker

		// Execute trade on DEX smart contract.
		const matchingEngine = accounts[9]
		const matchingEnginePrivateKey =
			'451aa3a496e0d2fab9564f65ce2310885b88b11c5cc0cc487195b0964f1e5eb1'
		const nonce = await getNonceOf(matchingEngine)
		const matchingMessage = abi.soliditySHA3(
			[
				'address',
				'address',
				'uint256',
				'uint256',
				'address',
				'address',
				'uint256',
			],
			[
				tokenMaker,
				tokenTaker,
				amountMaker,
				amountTaker,
				addressMaker,
				addressTaker,
				nonce,
			],
		)
		const { signature } = await signMessage(
			matchingMessage,
			matchingEnginePrivateKey,
		)

		await dex.trade(
			tokenMaker,
			tokenTaker,
			amountMaker,
			amountTaker,
			addressMaker,
			addressTaker,
			nonce,
			signature,
			{
				from: matchingEngine,
			},
		)

		const makerEndingBalanceOnDex = (
			await dex.balanceOf(maker)
		).toNumber()
		const makerEndingUSDXBalanceOnDex = (
			await dex.tokenBalanceOf(maker, fiat.address)
		).toNumber()
		const makerEndingStockBalanceOnDex = (
			await dex.tokenBalanceOf(maker, stock.address)
		).toNumber()
		const takerEndingBalanceOnDex = (
			await dex.balanceOf(taker)
		).toNumber()
		const takerEndingUSDXBalanceOnDex = (
			await dex.tokenBalanceOf(taker, fiat.address)
		).toNumber()
		const takerEndingStockBalanceOnDex = (
			await dex.tokenBalanceOf(taker, stock.address)
		).toNumber()

		expect(makerEndingBalanceOnDex).to.equal(1248)
		expect(makerEndingUSDXBalanceOnDex).to.equal(1248)
		expect(makerEndingStockBalanceOnDex).to.equal(0)

		expect(takerEndingBalanceOnDex).to.equal(1000)
		expect(takerEndingUSDXBalanceOnDex).to.equal(752)
		expect(takerEndingStockBalanceOnDex).to.equal(1)
	})

	const getNonceOf = async account => {
		const txCount = await web3.eth.getTransactionCount(account)
		return web3.utils.toHex(txCount)
	}

	const signMessage = async (message, privateKey) => {
		return await web3.eth.accounts.sign(
			'0x' + message.toString('hex'),
			privateKey,
		)
	}

	// TODO: Test that deposit work with web3.js
	// NOTE: Problem is probably coming from bad signature
	// it('should deposit when using web3.js ', async () => {
	// console.log(await web3.eth.getBalance(accounts[3]))
	// 	expect(false).to.equal(true)
	// })
})

// const orderSigning = () => {// // placeMakerOrder
// // Build message.
// const nonceMaker = await getNonceOf(maker)
// let messageMaker = abi.soliditySHA3(
// 	[
// 		'address',
// 		'address',
// 		'uint256',
// 		'uint256',
// 		'address',
// 		'uint256',
// 	],
// 	[
// 		tokenMaker,
// 		tokenTaker,
// 		amountMaker,
// 		amountTaker,
// 		addressTaker,
// 		nonceMaker,
// 	],
// )
// const makerSignedMessageObject = await signMessage(
// 	messageMaker,
// 	makerPrivateKey,
// )
//
// // placeTakerOrder
// // Build message.
// const nonceTaker = await getNonceOf(taker)
// let messageTaker = abi.soliditySHA3(
// 	[
// 		'address',
// 		'address',
// 		'uint256',
// 		'uint256',
// 		'address',
// 		'uint256',
// 	],
// 	[
// 		tokenMaker,
// 		tokenTaker,
// 		amountMaker,
// 		amountTaker,
// 		addressMaker,
// 		nonceTaker,
// 	],
// )
// const takerSignedMessageObject = await signMessage(
// 	messageTaker,
// 	takerPrivateKey,
// )}
