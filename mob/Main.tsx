import { MD3DarkTheme, Provider as PaperProvider } from "react-native-paper";
import App from "./App";

export default function Main() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <App />
    </PaperProvider>
  );
}
