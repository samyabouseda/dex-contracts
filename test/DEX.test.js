const { expect } = require('chai')
const _beforeEach = require('./before-each')

contract('DEX', accounts => {
	beforeEach(async () => {
		this.contracts = await _beforeEach(accounts)

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

	it('should allow user to deposit same tokens multiple times', async () => {
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
		const { fiat, dex } = this.contracts
		expect(false).to.equal(true)
	})
})
