const DEX = artifacts.require('DEX')

module.exports = async function(deployer, network, accounts) {
	await deployer.deploy(DEX, accounts[9])
}
