import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";


  describe("Testing multisig factory contract",function(){
      async function multisigDeployment(){
        const quorum = 4;
        const [owner, addr1,addr2,addr3,addr4,addr5,addr6,addr7] = await hre.ethers.getSigners();
        const validSigners = [addr1.address, addr2.address, addr3.address, addr4.address]

        const MultisigFactory = await hre.ethers.getContractFactory("MultisigFactory");
        const multisigFactory = await MultisigFactory.deploy();

        return {multisigFactory,validSigners,owner,addr1,addr2,addr7}
    }


    describe("Deployment", function(){
        const quorum = 4;
        
        it("should deploy Factory contract successfully", async function() {
            const { multisigFactory,validSigners,owner,addr7 } = await loadFixture(multisigDeployment);
            
            expect(await multisigFactory.createMultisigWallet(quorum,validSigners));
            await expect((await multisigFactory.getMultiSigClones()).length).to.be.gt(0)
        })

       


    })
  })