/**
 * This method deploys the contracts and set up the variables.
 */

const USDX = artifacts.require('USDX')
const USDXCrowdsale = artifacts.require('USDXCrowdsale')
const Stock = artifacts.require('Stock')
const StockICO = artifacts.require('StockICO')
const DEX = artifacts.require('DEX')

const _beforeEach = async accounts => {
	// Fiat config //
	this.fiat = await USDX.new()

	// Crowdsale config //
	this.rate = 231
	this.wallet = accounts[0]

	this.fiatCrowdsale = await USDXCrowdsale.new(
		this.rate,
		this.wallet,
		this.fiat.address,
	)
	// Transfer token ownership to crowdsale
	await this.fiat.addMinter(this.fiatCrowdsale.address)

	// Stock config //
	this.stock = await Stock.new('Apple Inc.', 'AAPL', 18, 1000000000)

	// StockICO config //
	this.pricePerShare = 248
	this.wallet = accounts[7]
	this.stockIco = await StockICO.new(
		this.stock.address,
		this.fiat.address,
		this.pricePerShare,
	)

	// Transfer token ownership to stock ico
	this.stock.transfer(
		this.stockIco.address,
		await this.stock.totalSupply(),
	)

	// DEX config //
	this.dex = await DEX.new(accounts[9]) // 9th account is matching engine

	return {
		fiat: this.fiat,
		fiatCrowdsale: this.fiatCrowdsale,
		dex: this.dex,
		stock: this.stock,
		stockIco: this.stockIco,
	}
}

module.exports = _beforeEach
