import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { OracleLottery } from "../typechain-types";

describe("OracleLottery", () => {
  let oracleLottery: OracleLottery;
  const ticketPrice = ethers.utils.parseEther("0.0001");
  const players = [
    "0x3f9D0284ef7F672E9835627FeE95AEf909C9e8C3",
    "0x5f1a1A035EB54F0387C0FdD1d4b91D147A7601bA",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  ];
  let winner: string;

  before(async function () {
    oracleLottery = await ethers.getContractAt(
      "OracleLottery",
      "0xaab0920e959Fc4124cF712aF815d2bc16d331dD3"
    );
  });

  it("Should add players to the lottery", async () => {
    for (let player of players) {
      const tx = await oracleLottery.enterLottery(player, {
        value: ticketPrice,
      });
      await tx.wait();
    }
    expect(await oracleLottery.getPlayers()).has.lengthOf(players.length);
  });

  it("Should draw the winner", async () => {
    const tx = await oracleLottery.drawWinner({ gasLimit: 300000 });
    await tx.wait();
    const event: { winner: string; payout: BigNumber } = await new Promise(
      async (resolve) => {
        oracleLottery.once("LotteryWon", async (winner, payout) => {
          resolve({ winner, payout });
        });
      }
    );
    expect(event.winner).to.be.oneOf(players);
    expect(event.payout).to.be.equal(ticketPrice.mul(players.length));
    winner = event.winner;
  });

  it("Should withdraw payout", async () => {
    expect(await oracleLottery.withdrawPayout(winner)).to.changeEtherBalance(
      winner,
      ticketPrice.mul(players.length)
    );
  });
});
