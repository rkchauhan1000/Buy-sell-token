const Migrations = artifacts.require("Token.sol");
const Migrations1 = artifacts.require("EthSwap.sol");
module.exports = async function(deployer) {
 await deployer.deploy(Migrations);

  const token= await Migrations.deployed();
  
 await deployer.deploy(Migrations1,token.address);
  const ethswap= await Migrations1.deployed();
 await token.transfer(ethswap.address,'1000000000000000000');
};