const { ethers } = require("hardhat");

async function main() {
  try {
    const TokenDistributor = await ethers.getContractFactory("TokenDistributor");
    const tokenDistributor = await TokenDistributor.deploy(); // Deploys the contract

    // Wait for the deployment to be confirmed
    await tokenDistributor.waitForDeployment();

    console.log("TokenDistributor deployed to:", await tokenDistributor.getAddress());
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
