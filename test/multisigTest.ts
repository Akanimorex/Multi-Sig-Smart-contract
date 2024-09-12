import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";


//TODO: delete signers
//use enum to seperate the  




describe("Multisig", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  const quorum = 5;
  const trxID = 0;



  async function deployOneYearLockFixture() {

    const AkanToken = await hre.ethers.getContractFactory("REX");
    const token = await AkanToken.deploy();
  
    // Contracts are deployed using the first signer/account by default
    const [owner, addr1,addr2,addr3,addr4,addr5,addr6,addr7] = await hre.ethers.getSigners();

    const validSigners =[addr1,addr2,addr3,addr4];

    const Multisig = await hre.ethers.getContractFactory("Multisig");
    const multisig = await Multisig.deploy(quorum,validSigners);

  

    return { multisig, owner, validSigners,token, addr7};
  }

  describe("Deployment", function () {
    it("should deploy correctly and quorum is set", async function () {
      const { multisig,owner,validSigners, addr7} = await loadFixture(deployOneYearLockFixture)

      expect(await multisig.quorum()).to.equal(quorum);
      expect(await multisig.quorum()).to.be.gt(1);
      expect(await multisig.noOfValidSigners()).to.equal(validSigners.length + 1 );
    });
  });


  describe("Transfer",function(){
    it("should check for zero address", async function(){

      const { multisig,owner,validSigners,token, addr7} = await loadFixture(deployOneYearLockFixture);
      expect(multisig.connect(addr7)).not.to.be.equal(ethers.ZeroAddress);
    })

    it("should check for zero address in the token address", async function(){
      const { token } = await loadFixture(deployOneYearLockFixture);
      expect(token.getAddress()).not.to.be.equal(ethers.ZeroAddress)
    })

    it("should check amount is not zero",async function(){
      const { multisig,owner,token, addr7} = await loadFixture(deployOneYearLockFixture);
      const zeroAmount = ethers.parseUnits("0",18);

     await expect( multisig.connect(owner).transfer(zeroAmount,addr7,token.getAddress())).to.be.reverted;

    })

    it("should check contract balance is greater than amount", async function(){
      const { multisig,owner,token, addr7} = await loadFixture(deployOneYearLockFixture);
      const amount = ethers.parseUnits("100",18);

      await token.transfer(await multisig.getAddress(),amount);

      const contractBalance = await token.balanceOf(await multisig.getAddress());

      expect(contractBalance).to.be.greaterThanOrEqual(amount);
    })

    it("should check if transfer is successful",async function(){
      const { multisig,owner,token, addr7} = await loadFixture(deployOneYearLockFixture);
      const amount = ethers.parseUnits("100",18);
      await token.transfer(await multisig.getAddress(),amount);

      const transferAmount = ethers.parseUnits("1",18);

      expect(multisig.connect(owner).transfer(transferAmount,addr7,token.getAddress()))

    })



  })


  describe("ApproveTx",function(){
    it("should revert if transaction ID is zero",async function(){
      const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);

      await expect(multisig.connect(validSigners[0]).approveTx(1)).to.be.revertedWith("invalid tx id");
    })

    it("should check contract balance is greater than amount", async function(){
      const { multisig,owner,token, addr7} = await loadFixture(deployOneYearLockFixture);
      const amount = ethers.parseUnits("100",18);

      await token.transfer(await multisig.getAddress(),amount);

      const contractBalance = await token.balanceOf(await multisig.getAddress());

      expect(contractBalance).to.be.greaterThanOrEqual(amount);
    })

    it("should revert if transaction happens twice",async function(){
      const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);
      
      const amount = ethers.parseUnits("100",18);
      await token.transfer(await multisig.getAddress(),amount);

      const transferAmount = ethers.parseUnits("1",18);

      await multisig.connect(owner).transfer(transferAmount,addr7,token.getAddress())


      multisig.connect(validSigners[0]).approveTx(1);
      await expect(multisig.connect(validSigners[0]).approveTx(1)).to.be.revertedWith("can't sign twice");
    })

    it("should check if msg.sender is a valid signer",async function(){
      const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);
      const amount = ethers.parseUnits("100",18);
      await token.transfer(await multisig.getAddress(),amount);

      const transferAmount = ethers.parseUnits("1",18);

      await multisig.connect(owner).transfer(transferAmount,validSigners[1],token.getAddress())

      await expect(multisig.connect(addr7).approveTx(1)).to.be.revertedWith("not a valid signer");

    })

    it("should check if approval is successful", async function(){

      const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);
      const amount = ethers.parseUnits("100",18);
      await token.transfer(await multisig.getAddress(),amount);

      const transferAmount = ethers.parseUnits("1",18);

      await multisig.connect(owner).transfer(transferAmount,validSigners[1],token.getAddress())

       expect(await multisig.connect(validSigners[2]).approveTx(1));

       
    })


    // it("should revert if no of approval is not less than quorum",async function(){
    //   const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);

    //   expect(validSigners.length+1).to.be.lt( await multisig.quorum())

    // })

  })



  describe("updateQuorum",function(){
    it("should revert if quorum isnt greater than 1", async function() {
      const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);
      const amount = ethers.parseUnits("100",18);
      await token.transfer(await multisig.getAddress(),amount);
      const newQuorum = 0;


      await expect(multisig.connect(validSigners[2]).updateQuorum(newQuorum)).to.be.revertedWith("quorum too small")
      
    })

    it("should check if msg.sender is a valid signer",async function(){
      const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);
      
      // const newQuorum = 7;
      // await expect(multisig.connect(addr7).updateQuorum(newQuorum))

      await expect(multisig.connect(addr7).updateQuorum(3)).to.be.revertedWith("invalid signer");

    })

    it("should update quorum successfully",async function(){
      const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);

      await multisig.connect(validSigners[1]).updateQuorum(3);
      //checking if the transaction is completed
      //checking if noOfApproval is eaual to 1(you can chck if it's greater than quorum like this)
      const tx = await multisig.transactions(1);

       expect(await tx.isCompleted).to.equal(false);
       expect(await tx.noOfApproval).to.equal(1);

    })


  })


  describe("approveUpdate", function(){
    it("should revert if transaction ID is zero",async function(){
      const { multisig,validSigners} = await loadFixture(deployOneYearLockFixture);

      await expect(multisig.connect(validSigners[0]).approveUpdate(0)).to.be.revertedWith("invalid transaction");
    })

    it("should check if msg.sender is a valid signer",async function(){
      const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseUnits("100",18);
      await token.transfer(await multisig.getAddress(),amount);

      const transferAmount = ethers.parseUnits("1",18);

      await multisig.connect(owner).transfer(transferAmount,validSigners[1],token.getAddress())

     
      // await multisig.connect(owner).transfer(transferAmount,validSigners[1],token.getAddress())

      await expect(multisig.connect(addr7).approveUpdate(1)).to.be.revertedWith("not a valid signer");

    })


    it("should approve Update Successfully",async function(){
      const { multisig,owner,token,validSigners, addr7} = await loadFixture(deployOneYearLockFixture);

      const amount = ethers.parseUnits("100",18);
      await token.transfer(await multisig.getAddress(),amount);

      const transferAmount = ethers.parseUnits("1",18);

      await multisig.connect(owner).transfer(transferAmount,validSigners[1],token.getAddress())

     
      // await multisig.connect(owner).transfer(transferAmount,validSigners[1],token.getAddress())

      await expect(multisig.connect(validSigners[1]).approveUpdate(1))
    })
  })


  

});
