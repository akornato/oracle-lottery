import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function App() {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: theme.colors.onBackground }}>
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
