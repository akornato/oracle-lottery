// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

// based on VRFv2DirectFundingConsumer.sol sample contract
// https://docs.chain.link/vrf/v2/direct-funding/examples/get-a-random-number/

contract OracleLottery is VRFConsumerBaseV2, ConfirmedOwner {
    event LotteryEntered(address player);
    event LotteryWon(address winner, uint256 value);
    event LotteryPayoutWithdrawn(address winner, uint256 value);
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    address[] public players;
    mapping(address => uint256) public payouts;
    uint256 ticketPrice = 0.0001 ether;

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    bytes32 keyHash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 300000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // Number of random values to retrieve in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 1;

    constructor(
        uint64 subscriptionId,
        address vrfCoordinatorAddress
    ) VRFConsumerBaseV2(vrfCoordinatorAddress) ConfirmedOwner(msg.sender) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinatorAddress);
        s_subscriptionId = subscriptionId;
    }

    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function enterLottery(address player) external payable {
        require(msg.value == ticketPrice, "value must equal ticket price");
        players.push(player);
        emit LotteryEntered(player);
    }

    function drawWinner() external returns (uint256 requestId) {
        require(players.length > 0, "no players have entered the lottery yet");

        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);

        uint256 winningNumber = _randomWords[0];
        uint256 winnerIndex = winningNumber % players.length;
        address winner = players[winnerIndex];
        uint payout = players.length * ticketPrice;
        payouts[winner] += payout;
        emit LotteryWon(winner, payout);
        delete players;
    }

    function withdrawPayout(address player) external {
        uint256 payout = payouts[player];
        require(payout > 0, "No payout for you");
        payouts[player] = 0;
        payable(player).transfer(payout);
        emit LotteryPayoutWithdrawn(player, payout);
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }
}
