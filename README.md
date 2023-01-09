# Oracle Lottery

This is a [React Native](https://reactnative.dev/) lottery mobile app fronting `OracleLottery` contract wich relies on [Chainlink](https://chain.link/) oracles to get a random number and determine the lottery winner.

Tech:

- [Hardhat](https://hardhat.org)
- [Chainlink](https://docs.chain.link/vrf/v2/direct-funding) with Direct Funding Method
- [Expo](https://expo.dev)
- [React Native Paper](https://reactnativepaper.com)

# Local dev

- `yarn sol:node` starts Hardhat Network
- `yarn sol:deploy` deploys `Lottery` contract
- `yarn mob:start` starts Expo dev server
