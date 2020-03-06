const { expect } = require('chai')

const USDX = artifacts.require('USDX')

contract('USDX', accounts => {
	beforeEach(async () => {
		this.token = await USDX.new()
	})

	it('should have the name Dextr. USD', async () => {
		const name = await this.token.name()
		expect(name).to.equal('Dextr. USD')
	})

	it('should have the symbol USDX', async () => {
		const name = await this.token.symbol()
		expect(name).to.equal('USDX')
	})

	it('should have 2 decimals', async () => {
		const decimals = await this.token.decimals()
		expect(decimals.toString()).to.equal('2')
	})
})
