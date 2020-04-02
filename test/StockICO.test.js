const _beforeEach = require('./before-each')

const { expect } = require('chai')

contract('StockICO', accounts => {
	beforeEach(async () => {
		this.contracts = await _beforeEach(accounts)
	})

	it('should have the AAPL token', async () => {
		const { stock, stockIco } = this.contracts
		const stockFromStockIco = await stockIco.stock()
		expect(stockFromStockIco).to.equal(stock.address)
	})

	it('should allow user to purchase AAPL token with USDX', async () => {
		const { fiat, stock } = this.contracts
		const accountOne = accounts[1]

		const fiatStartingBalance = (
			await fiat.balanceOf.call(accountOne)
		).toNumber()
		const stockStartingBalance = (
			await stock.balanceOf.call(accountOne)
		).toNumber()

		// ...

		const fiatEndingBalance = (
			await fiat.balanceOf.call(accountOne)
		).toNumber()
		const stockEndingBalance = (
			await stock.balanceOf.call(accountOne)
		).toNumber()

		expect(fiatStartingBalance).to.equal(20000)
		expect(stockStartingBalance).to.equal(0)
		expect(fiatEndingBalance).to.equal(17520) // 20'000 - (10 shares at 248 each)
		expect(stockEndingBalance).to.equal(10)
	})
})
