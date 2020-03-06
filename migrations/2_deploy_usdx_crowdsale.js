// const USDXCrowdsaleDeployer = artifacts.require(
// 	'USDXCrowdsaleDeployer',
// )
const USDXCrowdsale = artifacts.require('USDXCrowdsale')
const USDX = artifacts.require('USDX')

module.exports = async function(deployer, network, accounts) {
	let wallet = accounts[0]
	await deployer.deploy(USDX)
	const usdxToken = await USDX.deployed()
	const rate = 1
	await deployer.deploy(
		USDXCrowdsale,
		rate,
		wallet,
		usdxToken.address,
	)
}
