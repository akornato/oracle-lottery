// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

// based on VRFv2DirectFundingConsumer.sol sample contract
// https://docs.chain.link/vrf/v2/direct-funding/examples/get-a-random-number/

contract OracleLottery is VRFV2WrapperConsumerBase, ConfirmedOwner {
    event LotteryEntered(address player, uint256 value);
    event LotteryWon(address winner, uint256 value);
    event PayoutWithdrawn(address winner, uint256 value);
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );
    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */

    address[] public players;
    mapping(address => uint256) public payouts;

    uint256[] public requestIds;
    uint256 public lastRequestId;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 1000000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // Address LINK - hardcoded for Mumbai
    address linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;

    // address WRAPPER - hardcoded for Mumbai
    address wrapperAddress = 0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693;

    constructor()
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {}

    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function enterLottery(address player) public payable {
        require(msg.value > 0, "value must be greater than 0");
        players.push(player);
        emit LotteryEntered(player, msg.value);
    }

    function drawWinner() public returns (uint256 requestId) {
        require(players.length > 0, "no players have entered the lottery yet");
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            1
        );
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, 1);
    }

    function withdrawPayout() external {
        uint256 payout = payouts[msg.sender];
        require(payouts[msg.sender] > 0, "No payout for you");
        uint256 balanceBeforeTransfer = address(this).balance;
        payable(msg.sender).transfer(payout);
        assert(address(this).balance == balanceBeforeTransfer - payout);
        emit PayoutWithdrawn(msg.sender, payout);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );

        uint256 winningNumber = _randomWords[0];
        uint256 winnerIndex = winningNumber % players.length;
        address winner = players[winnerIndex];
        uint payout = address(this).balance;
        payouts[winner] += payout;
        delete players;
        emit LotteryWon(players[winnerIndex], payout);
    }

    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.paid, request.fulfilled, request.randomWords);
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
