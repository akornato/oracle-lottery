import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { Button, Surface } from "react-native-paper";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";
// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";
// Import the ethers library
import { ethers } from "ethers";
import { abi } from "sol/artifacts/contracts/OracleLottery.sol/OracleLottery.json";
import type { OracleLottery } from "sol/typechain-types";

const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/rplNk18yP3jGSbiL1KiR1URsPOq7jTmg"
);

export default function App() {
  const connector = useWalletConnect();
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const oracleLottery = new ethers.Contract(
      "0xaab0920e959Fc4124cF712aF815d2bc16d331dD3",
      abi,
      provider
    ) as OracleLottery;
    oracleLottery.getPlayers().then(setPlayers);
  }, []);

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
      <Surface style={styles.surface}>
        <Text>{players.length > 0 ? "Players:" : "No players yet"}</Text>
        {players.map((player) => (
          <Text>{player}</Text>
        ))}
      </Surface>
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
