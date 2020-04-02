const _beforeEach = require('./before-each')

const { expect } = require('chai')

contract('StockICO', accounts => {
	beforeEach(async () => {
		this.contracts = await _beforeEach(accounts)
		this.account = accounts[1]

		// Purchase USDX from first account
		await this.contracts.fiatCrowdsale.sendTransaction({
			value: '100',
			from: this.account,
		})
	})

	it('should have the AAPL token', async () => {
		const { stock, stockIco } = this.contracts
		const stockFromStockIco = await stockIco.stock()
		expect(stockFromStockIco).to.equal(stock.address)
	})

	it('should allow user to purchase AAPL token with USDX', async () => {
		const { fiat, stock, stockIco } = this.contracts

		const fiatStartingBalance = (
			await fiat.balanceOf.call(this.account)
		).toNumber()
		const stockStartingBalance = (
			await stock.balanceOf.call(this.account)
		).toNumber()

		await stockIco.buy(10, 248, { from: this.account })

		const fiatEndingBalance = (
			await fiat.balanceOf.call(this.account)
		).toNumber()
		const stockEndingBalance = (
			await stock.balanceOf.call(this.account)
		).toNumber()

		expect(fiatStartingBalance).to.equal(23100)
		expect(stockStartingBalance).to.equal(0)
		expect(fiatEndingBalance).to.equal(20620) // 23'100 - (10 shares at 248 each)
		expect(stockEndingBalance).to.equal(10)
	})
})
