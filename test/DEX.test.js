const { expect } = require('chai')

const USDX = artifacts.require('USDX')
const USDXCrowdsale = artifacts.require('USDXCrowdsale')
const DEX = artifacts.require('DEX')

contract('DEX', accounts => {
	beforeEach(async () => {
		// USDX config
		this.token = await USDX.new({ from: accounts[9] })

		// Crowdsale config
		this.rate = 231
		this.wallet = accounts[0]

		this.crowdsale = await USDXCrowdsale.new(
			this.rate,
			this.wallet,
			this.token.address,
		)

		// Transfer token ownership to crowdsale
		await this.token.addMinter(this.crowdsale.address, {
			from: accounts[9],
		})

		// DEX config
		this.dex = await DEX.new()

		// Purchase USDX from first account
		await this.crowdsale.sendTransaction({
			value: 10,
			from: accounts[1],
		})
	})

	it('account 1 should have 231 usdx', async () => {
		const accountOneBalance = (
			await this.token.balanceOf(accounts[1])
		).toNumber()
		expect(accountOneBalance).to.equal(2310)
	})

	it('should allow user to deposit USDX tokens', async () => {
		const accountOne = accounts[1]

		// Get initial balance of first account.
		const accountOneStartingBalance = (
			await this.token.balanceOf(accountOne)
		).toNumber()
		const accountOneStartingBalanceOnDex = (
			await this.dex.balanceOf(accountOne)
		).toNumber()

		// Deposit USDX on DEX smart contract.
		await this.dex.deposit(this.token.address, 100, {
			from: accountOne,
		})
		console.log(accountOne)

		// Get balance after first transaction.
		const accountOneEndingBalance = (
			await this.token.balanceOf(accountOne)
		).toNumber()
		const accountOneEndingBalanceOnDex = (
			await this.dex.balanceOf(accountOne)
		).toNumber()

		expect(accountOneStartingBalance).to.equal(2310)
		expect(accountOneEndingBalance).to.equal(2310)
		expect(accountOneStartingBalanceOnDex).to.equal(0)
		expect(accountOneEndingBalanceOnDex).to.equal(100)
	})
})
