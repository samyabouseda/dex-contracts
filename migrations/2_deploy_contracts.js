// const USDXCrowdsaleDeployer = artifacts.require(
// 	'USDXCrowdsaleDeployer',
// )
const USDXCrowdsale = artifacts.require('USDXCrowdsale')
const USDX = artifacts.require('USDX')

module.exports = function(deployer) {
	deployer.deploy(USDX)
	deployer.link(USDX, USDXCrowdsale)
	// deployer.deploy(USDXCrowdsale)
	//deployer.link(USDXCrowdsale, USDXCrowdsaleDeployer)
	//deployer.deploy(USDXCrowdsaleDeployer)
}
