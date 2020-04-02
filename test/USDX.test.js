const { expect } = require('chai')
const _beforeEach = require('./before-each')

contract('USDX', accounts => {
	beforeEach(async () => {
		this.contracts = await _beforeEach(accounts)
	})

	it('should have the name Dextr. USD', async () => {
		const { fiat } = this.contracts
		const name = await fiat.name()
		expect(name).to.equal('Dextr. USD')
	})

	it('should have the symbol USDX', async () => {
		const { fiat } = this.contracts
		const name = await fiat.symbol()
		expect(name).to.equal('USDX')
	})

	it('should have 18 decimals', async () => {
		const { fiat } = this.contracts
		const decimals = await fiat.decimals()
		expect(decimals.toString()).to.equal('18')
	})
})
