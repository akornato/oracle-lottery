# Oracle Lottery

This is a mobile lottery app interacting with a lottery contract which uses [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction) to get a random number and determine the lottery winner.

[OracleLottery](/sol/contracts/OracleLottery.sol) is deployed to [Polygon Mumbai](https://mumbai.polygonscan.com/address/0xaab0920e959Fc4124cF712aF815d2bc16d331dD3).

Tech:

- [Hardhat](https://hardhat.org)
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev)
- [React Native Paper](https://reactnativepaper.com)
- [Ethers](https://docs.ethers.org/v5/cookbook/react-native)
- [WalletConnect](https://docs.walletconnect.com/1.0/quick-start/dapps/react-native)

# Local dev

- `yarn sol:deploy` deploys `Lottery` contract to Mumbai
- `yarn sol:test` connects to `Lottery` contract on Mumbai, adds some players, draws the winner, waits for `LotteryWon` event (i.e. `fulfillRandomWords` called), and withdraws the winner's payout
- `yarn mob:web` starts Expo dev server
