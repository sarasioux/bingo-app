const Weed = artifacts.require("Weed");
const Bingo = artifacts.require("Bingo");

module.exports = async function (deployer) {
    await deployer.deploy(Bingo, Weed.address);
};
