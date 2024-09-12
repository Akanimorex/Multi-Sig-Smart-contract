// import {
//     time,
//     loadFixture,
//   } from "@nomicfoundation/hardhat-toolbox/network-helpers";
//   import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
//   import { expect } from "chai";
//   import hre from "hardhat";

// describe("Multisig", function () {
//   let multisig, erc20Token, owner, addr1, addr2, addr3, addr4, addr5;
//   const quorum = 3;
//   const initialSupply = ethers.utils.parseUnits("1000", 18); // 1000 tokens

//   beforeEach(async () => {
//     [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

//     // Deploy a mock ERC20 token
//     const ERC20Token = await ethers.getContractFactory("ERC20Token"); // assuming you have an ERC20 contract
//     erc20Token = await ERC20Token.deploy("Test Token", "TST", initialSupply);
//     await erc20Token.deployed();

//     // Deploy the multisig contract
//     const Multisig = await ethers.getContractFactory("Multisig");
//     multisig = await Multisig.deploy(quorum, [addr1.address, addr2.address, addr3.address, addr4.address]);
//     await multisig.deployed();

//     // Transfer some tokens to the multisig contract
//     await erc20Token.transfer(multisig.address, ethers.utils.parseUnits("100", 18)); // 100 tokens
//   });

//   it("should transfer tokens through the multisig contract", async function () {
//     const transferAmount = ethers.utils.parseUnits("10", 18); // 10 tokens
//     const recipient = addr5.address;

//     // Create a transaction to transfer tokens
//     await multisig.connect(addr1).transfer(transferAmount, recipient, erc20Token.address);

//     // Approve the transaction (quorum reached)
//     await multisig.connect(addr2).approveTx(1);
//     await multisig.connect(addr3).approveTx(1);

//     // Verify the balance of the recipient
//     const recipientBalance = await erc20Token.balanceOf(recipient);
//     expect(recipientBalance).to.equal(transferAmount);
//   });
// });
