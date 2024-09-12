import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const TokenModule = buildModule("REX", (m) => {


  const rex = m.contract("REX");

  return { rex };
});

export default TokenModule;
