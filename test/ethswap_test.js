const Token =artifacts.require('Token.sol')
const EthSwap =artifacts.require('EthSwap.sol')

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n) {
	return web3.utils.toWei(n,'ether');
}

contract('EthSwap',(accounts)=>{
	let token,ethswap
	before(async () =>
	{        token=await Token.new()
			 ethswap = await EthSwap.new(token.address)
			await token.transfer(ethswap.address,tokens('1000000'))
	})

	describe('Token deployment', async () =>{
		it('Token has a name', async () =>{
			const name = await token.name()
			assert.equal(name,'THAKUR')
		})
		it('Token has a symbol',async () =>{
			const symbol = await token.symbol()
			assert.equal(symbol,'RC')
		})
	})


	describe('EthSwap deployment', async () =>{
		it('EthSwap contract has a name', async () =>{
			const name = await ethswap.name()
			assert.equal(name,'EthSwap Instance Exchange')
		})
		it('Transferred token successfully', async () =>{
			assert.equal(await token.balanceOf(ethswap.address),tokens('1000000'))
			assert.equal(await token.balanceOf(token.address),tokens('0'))
		})

	})
	describe('Buy tokens', async () => {
		let result

		before(async () =>{
			result = await ethswap.buytokens({from: accounts[1], value :web3.utils.toWei('1','ether')})
		})
		it('Allows user to buy token', async () => {
			
	
			let balance = await token.balanceOf(accounts[1])
			assert.equal(balance.toString(),tokens('100'))

			let balancee = await token.balanceOf(ethswap.address)
			assert.equal(balancee.toString(),tokens('999900'))

	        balancee = await web3.eth.getBalance(ethswap.address)
	        assert.equal(balancee.toString(),web3.utils.toWei('1','ether'))
			const event = result.logs[0].args
			assert.equal(event.account, accounts[1])
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(),tokens('100').toString())
			assert.equal(event.rate.toString(),'100')
			console.log(token.address)
			console.log(ethswap.address)
			console.log(accounts[0])
			console.log(accounts[1])
		})
	})
	describe('Sell Tokens' ,async () =>{
		let result

		before(async() =>{
			await token.approve(ethswap.address, tokens('100'),{from: accounts[1]})
			result = await ethswap.selltoken(tokens('100'),{from :accounts[1]},)
		})
		it('allows user to sell tokens', async () =>{

			let balanceee = await token.balanceOf(accounts[1])
			assert.equal(balanceee.toString(),tokens('0'))

			let balancee = await token.balanceOf(ethswap.address)
			assert.equal(balancee.toString(),tokens('1000000'))
			balancee = await web3.eth.getBalance(ethswap.address)
			assert.equal(balancee.toString(),web3.utils.toWei('0','ether'))
			const event = result.logs[0].args
			assert.equal(event.account, accounts[1])
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(),tokens('100').toString())
			assert.equal(event.rate.toString(),'100')

			await ethswap.selltoken(tokens('500'),{from: accounts[1]}).should.be.rejected;
		})
	})
})