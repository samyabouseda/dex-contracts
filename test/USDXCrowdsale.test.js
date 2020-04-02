const { expect } = require('chai')
const _beforeEach = require('./before-each')

contract('USDXCrowdsale', accounts => {
	beforeEach(async () => {
		this.contracts = await _beforeEach(accounts)
	})

	it('should have the USDX token', async () => {
		const { fiat, fiatCrowdsale } = this.contracts
		const token = await fiatCrowdsale.token()
		expect(token).to.equal(fiat.address)
	})

	it('should allow user to purchase USDX token', async () => {
		const { fiat, fiatCrowdsale } = this.contracts

		// Setup 1 accounts.
		const accountOne = accounts[1]

		// Get initial balance of first account.
		const accountOneStartingBalance = (
			await fiat.balanceOf.call(accountOne)
		).toNumber()

		// Purchase USDX from first account
		await fiatCrowdsale.sendTransaction({
			value: 1,
			from: accountOne,
		})

		// Get balance after first transaction.
		const accountOneEndingBalance = (
			await fiat.balanceOf.call(accountOne)
		).toNumber()

		expect(accountOneStartingBalance).to.equal(0)
		expect(accountOneEndingBalance).to.equal(231)
	})
})
