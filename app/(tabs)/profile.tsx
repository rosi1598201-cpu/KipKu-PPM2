import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../config/firebase";
import { useFinance } from "../../context/FinanceContext";

export default function UserProfileScreen() {
  const { user, loading } = useFinance();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar 🚪",
      "Apakah Anda yakin ingin keluar dari akun ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            setLoggingOut(true);
            try {
              await signOut(auth);
              console.log("User berhasil log out.");
              // Arahkan kembali ke halaman login/welcome luar tab
              router.replace("/login");
            } catch (error) {
              Alert.alert(
                "Gagal Keluar ❌",
                "Terjadi kesalahan sistem saat mencoba log out.",
              );
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ],
    );
  };

  if (loading || loggingOut) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a5f7a" />
        <Text style={styles.loadingText}>Menghubungkan ke sistem...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5f7a" />

      <Text style={styles.pageTitle}>Profil Saya</Text>
      <Text style={styles.pageSubtitle}>
        Informasi kartu identitas mahasiswa dan manajemen akun
      </Text>

      {/* VIRTUAL STUDENT ID CARD */}
      <View
        style={[styles.studentCard, user?.isKipK && styles.studentCardKipk]}
      >
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.cardHeaderTitle}>KARTU DIGITAL MAHASISWA</Text>
            <Text style={styles.cardHeaderSub}>Fintech Student Tracker</Text>
          </View>
          <Ionicons name="hardware-chip-outline" size={32} color="#f1c40f" />
        </View>

        <Text style={styles.cardStudentName} numberOfLines={1}>
          {user?.nama || "Nama Belum Diatur"}
        </Text>

        <View style={styles.cardInfoGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>NOMOR INDUK (NIM)</Text>
            <Text style={styles.gridValue}>{user?.nim || "-"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>UNIVERSITAS / INSTITUT</Text>
            <Text style={styles.gridValue} numberOfLines={1}>
              {user?.kampus || "-"}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooterRow}>
          <Text style={styles.cardEmailText}>
            {user?.email || auth.currentUser?.email}
          </Text>
          {user?.isKipK ? (
            <View style={styles.badgeKipkInCard}>
              <Text style={styles.badgeKipkInCardText}>Penerima KIP-K</Text>
            </View>
          ) : (
            <View style={styles.badgeRegInCard}>
              <Text style={styles.badgeRegInCardText}>Reguler</Text>
            </View>
          )}
        </View>
      </View>

      {/* MENU DETAIL AKUN */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Detail Akun & Keamanan</Text>

        {/* Baris Email */}
        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#7f8c8d"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={styles.menuItemLabel}>Alamat Email</Text>
              <Text style={styles.menuItemValue}>
                {user?.email || auth.currentUser?.email || "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* Baris Status Beasiswa */}
        <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="school-outline"
              size={20}
              color="#7f8c8d"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={styles.menuItemLabel}>Status Jalur Kuliah</Text>
              <Text style={styles.menuItemValue}>
                {user?.isKipK
                  ? "Beasiswa KIP Kuliah (Aktif)"
                  : "Jalur Mandiri / Reguler"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* TOMBOL LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.logoutButtonText}>Keluar dari Aplikasi</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Aplikasi Keuangan Mahasiswa v1.0.2</Text>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fbf9", paddingHorizontal: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fbf9",
  },
  loadingText: {
    marginTop: 10,
    color: "#1a5f7a",
    fontSize: 14,
    fontWeight: "500",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a5f7a",
    marginTop: 24,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 4,
    marginBottom: 24,
  },

  // Tampilan Style Kartu Mahasiswa
  studentCard: {
    backgroundColor: "#2c3e50",
    borderRadius: 20,
    padding: 24,
    minHeight: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  studentCardKipk: { backgroundColor: "#1a5f7a" }, // Berwarna toska premium jika user adalah penerima KIP-K
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  cardHeaderTitle: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    opacity: 0.8,
  },
  cardHeaderSub: {
    color: "#f1c40f",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  cardStudentName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardInfoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridItem: { width: "48%" },
  gridLabel: {
    color: "#bdc3c7",
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gridValue: { color: "#fff", fontSize: 13, fontWeight: "600" },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  cardEmailText: { color: "#fff", fontSize: 12, opacity: 0.7 },
  badgeKipkInCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeKipkInCardText: { color: "#1a5f7a", fontSize: 10, fontWeight: "bold" },
  badgeRegInCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeRegInCardText: { color: "#fff", fontSize: 10, fontWeight: "bold" },

  // List Menu Detail
  menuSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2ebd5",
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a5f7a",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemLabel: { fontSize: 11, color: "#95a5a6", fontWeight: "500" },
  menuItemValue: {
    fontSize: 14,
    color: "#34495e",
    fontWeight: "600",
    marginTop: 2,
  },

  // Tombol Logout
  logoutButton: {
    backgroundColor: "#c0392b",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  versionText: {
    textAlign: "center",
    color: "#bdc3c7",
    fontSize: 11,
    marginTop: 24,
    marginBottom: 10,
  },
});
