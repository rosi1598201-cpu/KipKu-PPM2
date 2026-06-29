import { Slot } from "expo-router";
import { FinanceProvider } from "../context/FinanceContext";

export default function RootLayout() {
  return (
    <FinanceProvider>
      <Slot />
    </FinanceProvider>
  );
}
