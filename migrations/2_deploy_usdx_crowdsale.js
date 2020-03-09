const USDXCrowdsale = artifacts.require('USDXCrowdsale')
const USDX = artifacts.require('USDX')

module.exports = async function(deployer, network, accounts) {
	let wallet = accounts[0]
	await deployer.deploy(USDX)
	const token = await USDX.deployed()
	const rate = 231
	await deployer.deploy(USDXCrowdsale, rate, wallet, token.address)
	const crowdsale = await USDXCrowdsale.deployed()
	await token.addMinter(crowdsale.address)
}
