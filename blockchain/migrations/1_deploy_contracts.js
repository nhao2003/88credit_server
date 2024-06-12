const LoanContractManager = artifacts.require('LoanContractManager');
const Types = artifacts.require('Types');
module.exports = async function (deployer, network, accounts) {
  // Deploy the contract
  deployer.deploy(Types);
  deployer.link(Types, LoanContractManager);
  deployer.deploy(LoanContractManager);
};
