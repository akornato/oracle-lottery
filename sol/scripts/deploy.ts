import { ethers } from "hardhat";

async function main() {
  const OracleLotteryFactory = await ethers.getContractFactory("OracleLottery");
  const oracleLottery = await OracleLotteryFactory.deploy();
  await oracleLottery.deployed();
  console.log(`OracleLottery deployed to ${oracleLottery.address}`);

  const linkTokenContract = await ethers.getContractAt(
    "LinkTokenInterface",
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  );
  const txTransfer = await linkTokenContract.transfer(
    oracleLottery.address,
    ethers.utils.parseEther("1")
  );
  await txTransfer.wait();
  console.log(`1 LINK transferred to ${oracleLottery.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
