const { expect } = require('chai')

const GLDToken = artifacts.require('GLDToken')

contract('GLDToken', accounts => {
	beforeEach(async () => {
		this.token = await GLDToken.new(1000)
	})

	it('should have the name Gold', async () => {
		const name = await this.token.name()
		expect(name).to.equal('Gold')
	})
})
