pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

// based on VRFv2DirectFundingConsumer.sol sample contract
// https://docs.chain.link/vrf/v2/direct-funding/examples/get-a-random-number/

contract OracleLottery is VRFV2WrapperConsumerBase, ConfirmedOwner {
    event LotteryEntered(address player, uint256 value);
    event LotteryWon(address winner, uint256 value);
    event PayoutWithdrawn(address winner, uint256 value);

    address[] public players;
    mapping(address => uint256) public payouts;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // Address LINK - hardcoded for Goerli
    address linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;

    // address WRAPPER - hardcoded for Goerli
    address wrapperAddress = 0x708701a1DfF4f478de54383E49a627eD4852C816;

    constructor()
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {}

    function enterLottery(uint256 value) public payable {
        require(value > 0, "value must be greater than 0");
        players.push(msg.sender);
        emit LotteryEntered(msg.sender, value);
    }

    function drawWinner() public {
        require(players.length > 0, "no players have entered the lottery yet");
        requestRandomness(callbackGasLimit, requestConfirmations, 1);
    }

    function fulfillRandomWords(
        uint256,
        uint256[] memory _randomWords
    ) internal override {
        uint256 winningNumber = _randomWords[0];
        uint256 winnerIndex = winningNumber % players.length;
        address winner = players[winnerIndex];
        uint payout = address(this).balance;
        payouts[winner] += payout;
        delete players;
        emit LotteryWon(players[winnerIndex], payout);
    }

    function withdrawPayout() external {
        uint256 payout = payouts[msg.sender];
        require(payouts[msg.sender] > 0, "No payout for you");
        uint256 balanceBeforeTransfer = address(this).balance;
        payable(msg.sender).transfer(payout);
        assert(address(this).balance == balanceBeforeTransfer - payout);
        emit PayoutWithdrawn(msg.sender, payout);
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
