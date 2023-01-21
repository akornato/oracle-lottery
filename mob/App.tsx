import { useState, useEffect } from "react";
import Constants from "expo-constants";
const { infuraKey } = Constants.expoConfig.extra;
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { Button, Surface } from "react-native-paper";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";
// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";
// Import the ethers library
import { ethers, providers } from "ethers";
import { abi } from "sol/artifacts/contracts/OracleLottery.sol/OracleLottery.json";
import type { OracleLottery } from "sol/typechain-types";

export default function App() {
  const connector = useWalletConnect();
  const [players, setPlayers] = useState<string[]>();

  useEffect(() => {
    const getPlayers = async () => {
      if (connector.connected) {
        const provider = new WalletConnectProvider({
          rpc: {
            80001: `https://polygon-mumbai.infura.io/v3/${infuraKey}`,
          },
          infuraId: infuraKey,
          chainId: 80001,
          connector,
          qrcode: false,
        });
        await provider.enable();
        const web3Provider = new providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        const oracleLottery = new ethers.Contract(
          "0xaab0920e959Fc4124cF712aF815d2bc16d331dD3",
          abi,
          signer
        ) as OracleLottery;
        oracleLottery.getPlayers().then(setPlayers);
      }
    };
    getPlayers();
  }, [connector]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {connector.connected ? (
        <Button mode="contained" onPress={() => connector.killSession()}>
          Disconnect
        </Button>
      ) : (
        <Button mode="contained" onPress={() => connector.connect()}>
          Connect
        </Button>
      )}
      {connector.connected && players && (
        <Surface style={styles.surface}>
          <Text>{players.length > 0 ? "Players:" : "No players yet"}</Text>
          {players.map((player) => (
            <Text key={player}>{player}</Text>
          ))}
        </Surface>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    marginTop: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
