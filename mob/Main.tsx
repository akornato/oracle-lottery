import { MD3DarkTheme, Provider as PaperProvider } from "react-native-paper";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import App from "./App";

export default function Main() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <WalletConnectProvider
        redirectUrl={
          Platform.OS === "web" ? window.location.origin : "oraclelottery://"
        }
        storageOptions={{
          // @ts-ignore
          asyncStorage: AsyncStorage,
        }}
      >
        <App />
      </WalletConnectProvider>
    </PaperProvider>
  );
}
