import { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { Button, Surface } from "react-native-paper";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";
import { useContract } from "wagmi";
import { abi } from "sol/artifacts/contracts/OracleLottery.sol/OracleLottery.json";
import type { OracleLottery } from "sol/typechain-types";

export default function App() {
  const connector = useWalletConnect();
  const user = connector.accounts?.[0];
  const oracleLottery = useContract({
    address: "0xaab0920e959Fc4124cF712aF815d2bc16d331dD3",
    abi,
  }) as OracleLottery;
  const [players, setPlayers] = useState<string[]>();

  useEffect(() => {
    const getPlayers = async () => {
      if (connector.connected) {
        oracleLottery.getPlayers().then(setPlayers);
      }
    };
    getPlayers();
  }, [connector]);

  const enterLottery = useCallback(async () => {
    const tx = await oracleLottery.enterLottery(user, {
      value: ethers.utils.parseEther("0.0001"),
    });
    await tx.wait();
    oracleLottery.getPlayers().then(setPlayers);
  }, [oracleLottery]);

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
        <>
          <Surface style={styles.surface}>
            <Text>{players.length > 0 ? "Players:" : "No players yet"}</Text>
            {players.map((player) => (
              <Text key={player}>{player}</Text>
            ))}
          </Surface>
          {!players.includes[user] && (
            <Button mode="contained" onPress={enterLottery}>
              Enter lottery for 0.0001 MATIC
            </Button>
          )}
          {players.length > 0 && (
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => oracleLottery.drawWinner()}
            >
              Draw lottery winner
            </Button>
          )}
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    marginVertical: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 8,
  },
});
