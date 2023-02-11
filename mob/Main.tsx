import { FC, useState, useEffect, ReactNode } from "react";
import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import Constants from "expo-constants";
const { infuraKey } = Constants.expoConfig.extra;
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import WalletConnectWeb3Provider from "@walletconnect/web3-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";
// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";
import { providers } from "ethers";
import { WagmiConfig, createClient, Client } from "wagmi";
import App from "./App";

const WagmiProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const connector = useWalletConnect();
  const [client, setClient] = useState<Client>();

  useEffect(() => {
    const getProvider = async () => {
      if (connector.connected) {
        const provider = new WalletConnectWeb3Provider({
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
        const client = createClient({
          autoConnect: true,
          provider: web3Provider,
        });
        setClient(client);
      }
    };
    getProvider();
  }, [connector]);

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default function Main() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <WalletConnectProvider
        redirectUrl={
          Platform.OS === "web" ? window.location.origin : "oraclelottery://"
        }
        storageOptions={{
          // @ts-ignore
          asyncStorage: AsyncStorage,
        }}
      >
        <WagmiProvider>
          <App />
        </WagmiProvider>
      </WalletConnectProvider>
    </PaperProvider>
  );
}
