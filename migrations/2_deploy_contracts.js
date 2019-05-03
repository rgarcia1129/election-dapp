var SimpleStorage = artifacts.require("./SimpleStorage.sol");
const Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Election);
};
