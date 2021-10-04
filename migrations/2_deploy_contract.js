const NameStore = artifacts.require("NameStore");

module.exports = function (deployer) {
  deployer.deploy(NameStore);
};
