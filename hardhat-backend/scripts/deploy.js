const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting Crowdfunding DApp Deployment...");
  console.log("═══════════════════════════════════════════════════");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("═══════════════════════════════════════════════════");

  // Deploy KYCRegistry contract
  console.log("\n📋 Deploying KYCRegistry contract...");
  const KYCRegistry = await hre.ethers.getContractFactory("KYCRegistry_Maryam");
  const kycRegistry = await KYCRegistry.deploy();
  await kycRegistry.waitForDeployment();
  const kycAddress = await kycRegistry.getAddress();
  console.log("✅ KYCRegistry deployed to:", kycAddress);

  // Deploy Crowdfunding contract
  console.log("\n💰 Deploying Crowdfunding contract...");
  const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding_Maryam");
  const crowdfunding = await Crowdfunding.deploy(kycAddress);
  await crowdfunding.waitForDeployment();
  const crowdfundingAddress = await crowdfunding.getAddress();
  console.log("✅ Crowdfunding deployed to:", crowdfundingAddress);

  console.log("\n═══════════════════════════════════════════════════");
  console.log("📊 Deployment Summary:");
  console.log("═══════════════════════════════════════════════════");
  console.log("KYCRegistry:", kycAddress);
  console.log("Crowdfunding:", crowdfundingAddress);
  console.log("Admin:", deployer.address);
  console.log("═══════════════════════════════════════════════════");

  // Save contract addresses and ABIs to frontend
  const contractsDir = path.join(__dirname, "../../react-frontend/src/contracts");

  console.log("\n📁 Saving contract data to frontend...");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract addresses
  fs.writeFileSync(
    path.join(contractsDir, "contract-addresses.json"),
    JSON.stringify({
      KYCRegistry: kycAddress,
      Crowdfunding: crowdfundingAddress
    }, null, 2)
  );
  console.log("✅ Contract addresses saved");

  // Save KYCRegistry ABI
  const KYCRegistryArtifact = await hre.artifacts.readArtifact("KYCRegistry_Maryam");
  fs.writeFileSync(
    path.join(contractsDir, "KYCRegistry.json"),
    JSON.stringify(KYCRegistryArtifact, null, 2)
  );
  console.log("✅ KYCRegistry ABI saved");

  // Save Crowdfunding ABI
  const CrowdfundingArtifact = await hre.artifacts.readArtifact("Crowdfunding_Maryam");
  fs.writeFileSync(
    path.join(contractsDir, "Crowdfunding.json"),
    JSON.stringify(CrowdfundingArtifact, null, 2)
  );
  console.log("✅ Crowdfunding ABI saved");

  console.log("\n═══════════════════════════════════════════════════");
  console.log("🎉 Deployment Complete!");
  console.log("\n📋 Next Steps:");
  console.log("1. cd ../react-frontend");
  console.log("2. npm install");
  console.log("3. npm start");
  console.log("4. Connect MetaMask to localhost:8545");
  console.log("5. Import admin account using private key from Hardhat");
  console.log("═══════════════════════════════════════════════════");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });