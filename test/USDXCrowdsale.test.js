const { expect } = require('chai')

const USDX = artifacts.require('USDX')
const USDXCrowdsale = artifacts.require('USDXCrowdsale')

contract('USDXCrowdsale', accounts => {
	beforeEach(async () => {
		this.token = await USDX.new()

		// Crowdsale config
		this.rate = 500
		this.wallet = accounts[0]

		this.crowdsale = await USDXCrowdsale.new(
			this.rate,
			this.wallet,
			this.token.address,
		)
	})

	it('should have the USDX token', async () => {
		const token = await this.crowdsale.token()
		expect(token).to.equal(this.token.address)
	})
})
