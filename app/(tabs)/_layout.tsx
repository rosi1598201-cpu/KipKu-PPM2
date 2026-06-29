import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  // Mengambil data area aman (notch atas & nav bar bawah) perangkat secara real-time
  const insets = useSafeAreaInsets();

  // Menghitung padding bawah adaptif (jika HP menggunakan navigasi gestur, insets.bottom akan bernilai besar)
  const paddingBawah =
    Platform.OS === "ios"
      ? insets.bottom
      : insets.bottom > 0
        ? insets.bottom + 6
        : 14;
  const tinggiNavbar =
    Platform.OS === "ios"
      ? 60 + insets.bottom
      : insets.bottom > 0
        ? 60 + insets.bottom
        : 70;

  return (
    <Tabs
      screenOptions={{
        // Warna saat tab aktif (Hijau Tanaman agar segar)
        tabBarActiveTintColor: "#2d7a4d",
        // Warna saat tab tidak aktif
        tabBarInactiveTintColor: "#a0a0a0",
        // Gaya Header atas aplikasi
        headerStyle: {
          backgroundColor: "#1a5f7a", // Biru gelap elegan
          elevation: 2,
          shadowOpacity: 0.1,
        },
        headerTintColor: "#fff", // Warna teks header
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        // Gaya Tab Bar bawah yang sudah diperbaiki jaraknya tanpa error
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e2ebd5",
          height: tinggiNavbar,
          paddingBottom: paddingBawah,
          paddingTop: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: "Pemasukan",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "arrow-down-circle" : "arrow-down-circle-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="expense"
        options={{
          title: "Pengeluaran",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "arrow-up-circle" : "arrow-up-circle-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Laporan",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
