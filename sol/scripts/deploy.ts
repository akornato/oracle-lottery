import { ethers } from "hardhat";

async function main() {
  const OracleLotteryFactory = await ethers.getContractFactory("OracleLottery");
  const oracleLottery = await OracleLotteryFactory.deploy(
    3069,
    "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed"
  );
  await oracleLottery.deployed();
  console.log(`OracleLottery deployed to ${oracleLottery.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
