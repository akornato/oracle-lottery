import { ethers } from "hardhat";

async function main() {
  const OracleLotteryFactory = await ethers.getContractFactory("OracleLottery");
  const oracleLottery = await OracleLotteryFactory.deploy();
  await oracleLottery.deployed();
  console.log(`OracleLottery deployed to ${oracleLottery.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
