const hre = require("hardhat");
const ethers = require("hardhat").ethers;

async function main() {
  // 获取部署账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  try {
    // 部署 AccessControl
    console.log("Deploying AccessControl...");
    const AccessControl = await ethers.getContractFactory("AccessControl", deployer);
    const accessControl = await AccessControl.deploy();
    await accessControl.waitForDeployment();
    const accessControlAddress = await accessControl.getAddress();
    console.log("AccessControl deployed to:", accessControlAddress);

    // 部署 UserRegistry
    console.log("Deploying UserRegistry...");
    const UserRegistry = await ethers.getContractFactory("UserRegistryContract", deployer);
    const userRegistry = await UserRegistry.deploy(accessControlAddress);
    await userRegistry.waitForDeployment();
    const userRegistryAddress = await userRegistry.getAddress();
    console.log("UserRegistry deployed to:", userRegistryAddress);

    // 部署 BankRegistry
    console.log("Deploying BankRegistry...");
    const BankRegistry = await ethers.getContractFactory("BankRegistryContract", deployer);
    const bankRegistry = await BankRegistry.deploy(accessControlAddress);
    await bankRegistry.waitForDeployment();
    const bankRegistryAddress = await bankRegistry.getAddress();
    console.log("BankRegistry deployed to:", bankRegistryAddress);

    // 部署 DataStorage
    console.log("Deploying DataStorage...");
    const DataStorage = await ethers.getContractFactory("DataStorageContract", deployer);
    const dataStorage = await DataStorage.deploy(accessControlAddress);
    await dataStorage.waitForDeployment();
    const dataStorageAddress = await dataStorage.getAddress();
    console.log("DataStorage deployed to:", dataStorageAddress);

    // 部署 TaskManagement
    console.log("Deploying TaskManagement...");
    const TaskManagement = await ethers.getContractFactory("TaskManagementContract", deployer);
    const taskManagement = await TaskManagement.deploy(accessControlAddress);
    await taskManagement.waitForDeployment();
    const taskManagementAddress = await taskManagement.getAddress();
    console.log("TaskManagement deployed to:", taskManagementAddress);

    // 保存部署地址到文件
    const fs = require("fs");
    const addresses = {
      accessControl: accessControlAddress,
      userRegistry: userRegistryAddress,
      bankRegistry: bankRegistryAddress,
      dataStorage: dataStorageAddress,
      taskManagement: taskManagementAddress
    };

    fs.writeFileSync("deployments.json", JSON.stringify(addresses, null, 2));
    console.log("Contract addresses saved to deployments.json");

  } catch (error) {
    console.error("Error during deployment:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });