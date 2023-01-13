# Oracle Lottery

This is a [React Native](https://reactnative.dev/) lottery mobile app interacting with `OracleLottery` contract which uses [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction) to get a random number and determine the lottery winner.

Tech:

- [Hardhat](https://hardhat.org)
- [Expo](https://expo.dev)
- [React Native Paper](https://reactnativepaper.com)

# Local dev

- `yarn sol:node` starts Hardhat Network
- `yarn sol:deploy` deploys `Lottery` contract
- `yarn mob:start` starts Expo dev server
