import { ethers } from "hardhat";
import { expect } from "chai";
import { OracleLottery } from "../typechain-types";

describe("OracleLottery", () => {
  let oracleLottery: OracleLottery;

  before(async function () {
    oracleLottery = await ethers.getContractAt(
      "OracleLottery",
      "0x10D667A76C6104b3bCF2Aa24bB7500dBB8f3295F"
    );
  });

  it("Should add players to the lottery", async () => {
    const tx1 = await oracleLottery.enterLottery(
      "0x3f9D0284ef7F672E9835627FeE95AEf909C9e8C3",
      { value: ethers.utils.parseEther("0.0001") }
    );
    await tx1.wait();
    const tx2 = await oracleLottery.enterLottery(
      "0x5f1a1A035EB54F0387C0FdD1d4b91D147A7601bA",
      { value: ethers.utils.parseEther("0.0001") }
    );
    await tx2.wait();
    const tx3 = await oracleLottery.enterLottery(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      { value: ethers.utils.parseEther("0.0001") }
    );
    await tx3.wait();
    const players = await oracleLottery.getPlayers();
    expect(players.length).to.eq(3);
  });

  it("Should draw the winner", async () => {
    const contractBalanceBefore = await ethers.provider.getBalance(
      oracleLottery.address
    );
    expect(contractBalanceBefore).to.be.equal(
      ethers.utils.parseEther("0.0003")
    );
    const tx = await oracleLottery.drawWinner({ gasLimit: 500000 });
    await tx.wait();
    const contractBalanceAfter = await ethers.provider.getBalance(
      oracleLottery.address
    );
    expect(contractBalanceAfter).to.be.equal(0);
  });
});
