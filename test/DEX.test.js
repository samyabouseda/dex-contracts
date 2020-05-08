const { expect } = require('chai')
const _beforeEach = require('./before-each')

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

	// it('should allow user to deposit stock tokens multiple times', async () => {
	// 	// check that balanceOf specific token is equal to the amount sent.
	// 	const { fiat, dex } = this.contracts
	// 	expect(false).to.equal(true)
	// })
	// TODO: Test that deposit work with web3.js
	// NOTE: Problem is probably coming from bad signature
	it('should deposit when using web3.js ', async () => {
		expect(false).to.equal(true)
	})
})
