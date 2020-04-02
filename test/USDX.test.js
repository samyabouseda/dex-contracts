const { expect } = require('chai')
const USDX = artifacts.require('USDX')
const _beforeEach = require('./before-each')

contract('USDX', accounts => {
	beforeEach(async () => {
		const obj = await _beforeEach(accounts)
		this.fiat = await obj.fiat
	})

	it('should have the name Dextr. USD', async () => {
		const name = await this.fiat.name()
		expect(name).to.equal('Dextr. USD')
	})

	it('should have the symbol USDX', async () => {
		const name = await this.fiat.symbol()
		expect(name).to.equal('USDX')
	})

	it('should have 18 decimals', async () => {
		const decimals = await this.fiat.decimals()
		expect(decimals.toString()).to.equal('18')
	})
})
