const USDX = artifacts.require('USDX')
const Stock = artifacts.require('Stock')
const StockICO = artifacts.require('StockICO')

module.exports = async function(deployer, network, accounts) {
	let wallet = accounts[0]
	await deployer.deploy(
		Stock, // stock contract
		'Apple Inc.', // stock name
		'AAPL', // stock symbol
		18, // number of decimals
		1000000000, // initial supply
	)
	const fiat = await USDX.deployed()
	const stock = await Stock.deployed()

	const pricePerShare = 248
	await deployer.deploy(
		StockICO,
		stock.address,
		fiat.address,
		pricePerShare,
	)
	const stockIco = await StockICO.deployed()

	await stock.transfer(stockIco.address, await stock.totalSupply())
}
