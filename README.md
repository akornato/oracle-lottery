# Oracle Lottery

This is a mobile lottery app interacting with [OracleLottery](/sol/contracts/OracleLottery.sol) contract which uses [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction) to get a random number and determine the lottery winner.

Tech:

- [Hardhat](https://hardhat.org)
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev)
- [React Native Paper](https://reactnativepaper.com)
- [Ethers](https://docs.ethers.org/v5/cookbook/react-native)
- [WalletConnect](https://docs.walletconnect.com/1.0/quick-start/dapps/react-native)

# Local dev

- `yarn sol:deploy` deploys `Lottery` contract to Mumbai
- `yarn sol:test` tests `Lottery` contract on Mumbai
- `yarn mob:web` starts Expo dev server
