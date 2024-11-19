const { expect } = require("chai");
const { ethers } = require("hardhat");
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function generateFHEKeys(publicKey) {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate_keys`, {
      public_key: publicKey,
      server_key: ""
    });
    return {
      fhePublicKey: response.data.fhe_public_key,
      clientKey: response.data.client_key
    };
  } catch (error) {
    console.error('Failed to generate FHE keys:', error);
    throw error;
  }
}

describe("Deployed Contracts Test", function () {
  let owner;
  let accessControl;
  let userRegistry;
  let bankRegistry;
  let dataStorage;
  let taskManagement;

  before(async function () {
    [owner] = await ethers.getSigners();
    
    // 连接到已部署的合约
    accessControl = await ethers.getContractAt(
      "AccessControl",
      "0x412d17a4b6a79953bc891106b420bcd4493cd1cd"
    );

    userRegistry = await ethers.getContractAt(
      "UserRegistryContract",
      "0x7b4a4ec3ed0706a7f623ccb004c9660b06b8607b"
    );

    bankRegistry = await ethers.getContractAt(
      "BankRegistryContract",
      "0x2022052c63ac06768984abce6a3a2f889e9542db"
    );

    dataStorage = await ethers.getContractAt(
      "DataStorageContract",
      "0x2f4de204ede2876817dadc543f264c6b237b0110"
    );

    taskManagement = await ethers.getContractAt(
      "TaskManagementContract",
      "0x7a9b6d564d5d191093a29b7c760dd6af931cae73"
    );
  });

  describe("Access Control", function () {
    it("Should confirm owner is admin", async function () {
      expect(await accessControl.isAdmin(owner.address)).to.be.true;
    });
  });

  describe("User Registry", function () {
    it("Should register a new user", async function () {
      // 生成用户公钥
      const publicKey = "0x" + "1234".repeat(16); // 32 bytes hex string
      
      // 获取 FHE 密钥
      const { fhePublicKey, clientKey } = await generateFHEKeys(publicKey);

      console.log("fhePublicKey:", fhePublicKey);
      
      // 注册用户，使用固定的 serverKey
      const serverKey = "test_server_key";

      await expect(userRegistry.registerUser(publicKey, fhePublicKey, serverKey))
        .to.emit(userRegistry, "UserRegistered")
        .withArgs(owner.address, 1);

      const user = await userRegistry.users(owner.address);
      expect(user.isActive).to.be.true;
      
      // 验证存储的密钥
      expect(user.publicKey).to.equal(publicKey);
      expect(user.fhePublicKey).to.equal(fhePublicKey);
      expect(user.serverKey).to.equal(serverKey);
    });
  });

//   describe("Bank Registry", function () {
//     it("Should register a new bank", async function () {
//       // 创建一个新的钱包作为银行
//       const bankWallet = ethers.Wallet.createRandom().connect(ethers.provider);
      
//       // 添加银行权限
//       await accessControl.addBank(bankWallet.address);
      
//       const publicKey = "0x" + "5678".repeat(16); // 32 bytes hex string
//       await expect(bankRegistry.connect(bankWallet).registerBank(publicKey))
//         .to.emit(bankRegistry, "BankRegistered")
//         .withArgs(bankWallet.address, 1);

//       const bank = await bankRegistry.banks(bankWallet.address);
//       expect(bank.isActive).to.be.true;
//     });
//   });

//   describe("Task Management", function () {
//     it("Should create and complete a task", async function () {
//       // 创建银行和用户钱包
//       const bankWallet = ethers.Wallet.createRandom().connect(ethers.provider);
//       const userWallet = ethers.Wallet.createRandom().connect(ethers.provider);

//       // 设置权限
//       await accessControl.addBank(bankWallet.address);
//       await accessControl.registerUser(userWallet.address);

//       // 创建任务
//       await expect(taskManagement.connect(userWallet).createTask(
//         bankWallet.address,
//         "test_task"
//       )).to.emit(taskManagement, "TaskCreated")
//         .withArgs(1, bankWallet.address, userWallet.address, "test_task");

//       // 完成任务 - 注意这里使用字符串而不是bytes
//       const result = "encrypted_result_string";
//       await expect(taskManagement.connect(bankWallet).completeTask(1, result))
//         .to.emit(taskManagement, "TaskCompleted")
//         .withArgs(1, result);

//       const task = await taskManagement.getTask(1);
//       expect(task.isCompleted).to.be.true;

//       // 发布任务结果 - signature仍然是bytes
//       const signature = "0x" + "9abc".repeat(16); // 32 bytes hex string
//       await expect(taskManagement.connect(userWallet).publishTaskResult(1, signature))
//         .to.emit(taskManagement, "TaskPublished")
//         .withArgs(1, signature);

//       const publishedTask = await taskManagement.getTask(1);
//       expect(publishedTask.isPublished).to.be.true;
//     });
//   });
}); 