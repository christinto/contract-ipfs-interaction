var ReferrerContract = artifacts.require("./Referrer.sol");

module.exports = function(deployer) {
  deployer.deploy(ReferrerContract);
};