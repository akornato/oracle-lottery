# Oracle Lottery

This is a [React Native](https://reactnative.dev/) lottery mobile app interacting with `OracleLottery` contract which uses [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction) to get a random number and determine the lottery winner.

Tech:

- [Hardhat](https://hardhat.org)
- [Expo](https://expo.dev)
- [React Native Paper](https://reactnativepaper.com)
- [WalletConnect](https://docs.walletconnect.com/1.0/quick-start/dapps/react-native)

# Local dev

- `yarn sol:deploy` deploys `Lottery` contract to Mumbai
- `yarn sol:test` tests `Lottery` contract on Mumbai
- `yarn mob:web` starts Expo dev server
