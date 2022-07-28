const F1Token = artifacts.require("F1Token");

module.exports = function(deployer) {
  deployer.deploy(F1Token);
};
