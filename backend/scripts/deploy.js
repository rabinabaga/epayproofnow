const hre = require("hardhat");

async function main() {
  // Get the contract factory for PaymentRecorder
  const FeeManagement = await hre.ethers.getContractFactory("FeeManagement");

  // Deploy the PaymentRecorder contract
  const feeManagement = await FeeManagement.deploy();

  // Wait for the contract to be deployed
  await feeManagement.waitForDeployment();

  // Log the deployed contract address
  console.log("Fee Management deployed to:", feeManagement.target);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
