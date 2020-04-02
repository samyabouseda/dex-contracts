const { expect } = require('chai')
const _beforeEach = require('./before-each')

contract('STOCK', accounts => {
	beforeEach(async () => {
		this.contracts = await _beforeEach(accounts)
	})

	it('should have the name Apple Inc.', async () => {
		const { stock } = this.contracts
		const name = await stock.name()
		expect(name).to.equal('Apple Inc.')
	})

	it('should have the symbol AAPL', async () => {
		const { stock } = this.contracts
		const name = await stock.symbol()
		expect(name).to.equal('AAPL')
	})

	it('should have 18 decimals', async () => {
		const { stock } = this.contracts
		const decimals = await stock.decimals()
		expect(decimals.toString()).to.equal('18')
	})

	it('should have an initial supply of 1000000000', async () => {
		const { stock } = this.contracts
		const initialSupply = await stock.totalSupply()
		expect(initialSupply.toString()).to.equal('1000000000')
	})
})
