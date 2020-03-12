const { expect } = require('chai')

const USDX = artifacts.require('USDX')
const USDXCrowdsale = artifacts.require('USDXCrowdsale')

contract('USDXCrowdsale', accounts => {
	beforeEach(async () => {
		this.token = await USDX.new()

		// Crowdsale config
		this.rate = 231
		this.wallet = accounts[0]

		this.crowdsale = await USDXCrowdsale.new(
			this.rate,
			this.wallet,
			this.token.address,
		)

		// Transfer token ownership to crowdsale
		await this.token.addMinter(this.crowdsale.address)
	})

	it('should have the USDX token', async () => {
		const token = await this.crowdsale.token()
		expect(token).to.equal(this.token.address)
	})

	it('should allow user to purchase USDX token', async () => {
		// Setup 1 accounts.
		const accountOne = accounts[1]

		// Get initial balance of first account.
		const accountOneStartingBalance = (
			await this.token.balanceOf.call(accountOne)
		).toNumber()

		// Purchase USDX from first account
		await this.crowdsale.sendTransaction({
			value: 1,
			from: accountOne,
		})

		// Get balance after first transaction.
		const accountOneEndingBalance = (
			await this.token.balanceOf.call(accountOne)
		).toNumber()

		expect(accountOneStartingBalance).to.equal(0)
		expect(accountOneEndingBalance).to.equal(231)
	})
})
