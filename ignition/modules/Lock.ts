import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const LockModule = buildModule("MultisigFactory", (m) => {


  const multisigFactory = m.contract("MultisigFactory");

  return { multisigFactory };
});

export default LockModule;
