import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useTheme, Button } from "react-native-paper";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

export default function App() {
  const theme = useTheme();
  const connector = useWalletConnect();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {connector.connected ? (
        <Button onPress={() => connector.killSession()}>Disconnect</Button>
      ) : (
        <Button onPress={() => connector.connect()}>Connect</Button>
      )}
      <StatusBar style="auto" />
    </View>
  );
}
