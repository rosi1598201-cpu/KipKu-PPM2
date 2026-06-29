import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFinance } from "../../context/FinanceContext";

export default function Dashboard() {
  const { user, getFinancialSummary, transactions, loading } = useFinance();

  const summary = getFinancialSummary
    ? getFinancialSummary()
    : { totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 };
  const { totalPemasukan, totalPengeluaran, saldo } = summary;

  const formatRupiah = (num: number) => {
    const value = num || 0;
    return "Rp " + value.toLocaleString("id-ID");
  };

  const namaPanggilan = user?.nama ? user.nama.split(" ")[0] : "Mahasiswa";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a5f7a" />
        <Text style={styles.loadingText}>Memuat data keuangan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5f7a" />

      {/* HEADER WELCOME */}
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeTextWrapper}>
          <Text style={styles.welcomeLabel}>Halo, Selamat Datang 👋</Text>
          <Text style={styles.usernameText}>{namaPanggilan}</Text>
        </View>
        {user?.isKipK && (
          <View style={styles.kipkBadge}>
            <Ionicons name="school" size={14} color="#2d7a4d" />
            <Text style={styles.kipkBadgeText}>KIP-K Aktif</Text>
          </View>
        )}
      </View>

      {/* CARD UTAMA */}
      <View style={styles.mainWalletCard}>
        <Text style={styles.walletLabel}>Total Saldo Keuangan</Text>
        <Text style={styles.walletValue}>{formatRupiah(saldo)}</Text>

        <View style={styles.walletDivider} />

        <View style={styles.walletInfoRow}>
          <View style={styles.walletInfoItem}>
            <Ionicons
              name="card"
              size={16}
              color="#e2ebd5"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.walletInfoText} numberOfLines={1}>
              {user?.kampus || "Kampus belum diatur"}
            </Text>
          </View>
          <Text style={styles.walletInfoText}>NIM: {user?.nim || "-"}</Text>
        </View>
      </View>

      {/* GRID METERAN MASUK KELUAR */}
      <View style={styles.flowGrid}>
        <View style={[styles.flowCard, styles.flowIncome]}>
          <View style={styles.flowHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: "#e8f5e9" }]}>
              <Ionicons name="arrow-down" size={18} color="#2ecc71" />
            </View>
            <Text style={styles.flowLabel}>Total Masuk</Text>
          </View>
          <Text style={[styles.flowValue, { color: "#2ecc71" }]}>
            {formatRupiah(totalPemasukan)}
          </Text>
        </View>

        <View style={[styles.flowCard, styles.flowExpense]}>
          <View style={styles.flowHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: "#fce8e6" }]}>
              <Ionicons name="arrow-up" size={18} color="#e74c3c" />
            </View>
            <Text style={styles.flowLabel}>Total Keluar</Text>
          </View>
          <Text style={[styles.flowValue, { color: "#e74c3c" }]}>
            {formatRupiah(totalPengeluaran)}
          </Text>
        </View>
      </View>

      {/* RIWAYAT AKTIVITAS TERBARU */}
      <View style={styles.historySection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          <Text style={styles.sectionSubLink}>5 Terakhir</Text>
        </View>

        {!transactions || transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={40} color="#b0b0b0" />
            <Text style={styles.emptyText}>
              Belum ada catatan keuangan masuk atau keluar.
            </Text>
          </View>
        ) : (
          transactions.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <View style={styles.transLeftBlock}>
                <View
                  style={[
                    styles.transIconBox,
                    {
                      backgroundColor:
                        item.type === "pemasukan" ? "#e8f5e9" : "#f5f5f5",
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      item.type === "pemasukan"
                        ? "log-in-outline"
                        : "log-out-outline"
                    }
                    size={20}
                    color={item.type === "pemasukan" ? "#2ecc71" : "#7f8c8d"}
                  />
                </View>
                <View style={styles.transTextContent}>
                  <Text style={styles.transKet} numberOfLines={1}>
                    {item.keterangan || "Tanpa Keterangan"}
                  </Text>
                  <Text style={styles.transSub}>
                    {item.tanggal ? item.tanggal.split("T")[0] : "-"} •{" "}
                    {item.kategori}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.transNominal,
                  { color: item.type === "pemasukan" ? "#2ecc71" : "#333" },
                ]}
              >
                {item.type === "pemasukan" ? "+" : "-"}{" "}
                {formatRupiah(item.nominal)}
              </Text>
            </View>
          ))
        )}
      </View>

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
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  welcomeTextWrapper: { flex: 1 },
  welcomeLabel: { fontSize: 13, color: "#7f8c8d" },
  usernameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a5f7a",
    marginTop: 2,
  },
  kipkBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f4ea",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#aedcc0",
  },
  kipkBadgeText: {
    color: "#2d7a4d",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  mainWalletCard: {
    backgroundColor: "#1a5f7a",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#1a5f7a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  walletLabel: { color: "#e2ebd5", fontSize: 13, letterSpacing: 0.5 },
  walletValue: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 6,
  },
  walletDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginVertical: 16,
  },
  walletInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  walletInfoText: { color: "#fff", fontSize: 12, opacity: 0.85 },
  flowGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  flowCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2ebd5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  flowIncome: { borderLeftWidth: 4, borderLeftColor: "#2ecc71" },
  flowExpense: { borderLeftWidth: 4, borderLeftColor: "#e74c3c" },
  flowHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  flowLabel: { fontSize: 12, color: "#7f8c8d", fontWeight: "500" },
  flowValue: { fontSize: 15, fontWeight: "bold" },
  historySection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2ebd5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1a5f7a" },
  sectionSubLink: { fontSize: 12, color: "#2d7a4d", fontWeight: "600" },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  transLeftBlock: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  transIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transTextContent: { flex: 1 },
  transKet: { fontSize: 14, fontWeight: "600", color: "#2c3e50" },
  transSub: { fontSize: 11, color: "#95a5a6", marginTop: 2 },
  transNominal: { fontSize: 14, fontWeight: "bold" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyText: {
    textAlign: "center",
    color: "#95a5a6",
    fontSize: 13,
    marginTop: 10,
    paddingHorizontal: 20,
  },
});
