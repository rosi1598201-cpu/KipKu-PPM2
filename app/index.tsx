import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useFinance } from "../context/FinanceContext";

export default function Index() {
  const { user, loading } = useFinance();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
