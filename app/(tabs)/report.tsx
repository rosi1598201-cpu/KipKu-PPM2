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

export default function FinanceReport() {
  const { transactions, getFinancialSummary, loading } = useFinance();

  const summary = getFinancialSummary
    ? getFinancialSummary()
    : { totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 };
  const { totalPemasukan, totalPengeluaran, saldo } = summary;

  const formatRupiah = (num: number) => {
    return "Rp " + (num || 0).toLocaleString("id-ID");
  };

  const getCategoryAnalysis = () => {
    const analysis: { [key: string]: number } = {};
    const expenseTransactions = transactions.filter(
      (t) => t.type === "pengeluaran",
    );

    expenseTransactions.forEach((t) => {
      const nominal = isNaN(Number(t.nominal)) ? 0 : Number(t.nominal);
      if (analysis[t.kategori]) {
        analysis[t.kategori] += nominal;
      } else {
        analysis[t.kategori] = nominal;
      }
    });

    return Object.keys(analysis)
      .map((key) => {
        const totalKategori = analysis[key];
        const persentase =
          totalPengeluaran > 0 ? (totalKategori / totalPengeluaran) * 100 : 0;
        return {
          kategori: key,
          total: totalKategori,
          persentase: persentase,
        };
      })
      .sort((a, b) => b.total - a.total);
  };

  const categoryData = getCategoryAnalysis();
  const rasioPengeluaran =
    totalPemasukan > 0 ? totalPengeluaran / totalPemasukan : 0;
  const lebarProgressBar = Math.min(rasioPengeluaran * 100, 100);

  const getKesehatanStatus = () => {
    if (rasioPengeluaran === 0)
      return { teks: "Belum Ada Transaksi", warna: "#7f8c8d" };
    if (rasioPengeluaran <= 0.4)
      return { teks: "Sangat Sehat (Hemat) 💚", warna: "#2ecc71" };
    if (rasioPengeluaran <= 0.7)
      return { teks: "Wajar (Sesuai Anggaran) 💛", warna: "#f1c40f" };
    return { teks: "Boros / Kritis ⚠️", warna: "#e74c3c" };
  };
  const statusKeuangan = getKesehatanStatus();

  const getCategoryIcon = (kat: string) => {
    switch (kat) {
      case "Makan & Minum":
        return "fast-food-outline";
      case "Kost / Kontrakan":
        return "home-outline";
      case "Tugas & Kuliah":
        return "book-outline";
      case "Transportasi":
        return "car-outline";
      case "Hiburan / Self Reward":
        return "gift-outline";
      default:
        return "pie-chart-outline";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a5f7a" />
        <Text style={styles.loadingText}>Menganalisis laporan keuangan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5f7a" />

      <Text style={styles.pageTitle}>Laporan Keuangan</Text>
      <Text style={styles.pageSubtitle}>
        Pantau dan evaluasi struktur pengeluaran bulanan Anda
      </Text>

      {/* CARD KESEHATAN KEUANGAN */}
      <View style={styles.healthCard}>
        <View style={styles.healthHeader}>
          <Text style={styles.healthLabel}>Status Anggaran Anda:</Text>
          <Text
            style={[styles.healthStatusText, { color: statusKeuangan.warna }]}
          >
            {statusKeuangan.teks}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBarFilled,
              {
                width: `${lebarProgressBar}%`,
                backgroundColor: statusKeuangan.warna,
              },
            ]}
          />
        </View>
        <Text style={styles.progressInfo}>
          Anda telah menghabiskan{" "}
          <Text style={{ fontWeight: "bold" }}>
            {(rasioPengeluaran * 100).toFixed(1)}%
          </Text>{" "}
          dari total pemasukan uang yang dicatat.
        </Text>
      </View>

      {/* RINGKASAN AKUMULASI */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Dana Masuk</Text>
          <Text style={[styles.summaryValue, { color: "#2ecc71" }]}>
            {formatRupiah(totalPemasukan)}
          </Text>
        </View>

        {/* BARIS YANG SUDAH DIPERBAIKI (MENGGUNAKAN NATIVE BORDER TOP & BOTTOM) */}
        <View
          style={[
            styles.summaryRow,
            {
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#f5f5f5",
              paddingVertical: 12,
              marginVertical: 12,
            },
          ]}
        >
          <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
          <Text style={[styles.summaryValue, { color: "#e74c3c" }]}>
            {formatRupiah(totalPengeluaran)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text
            style={[
              styles.summaryLabel,
              { fontWeight: "bold", color: "#1a5f7a" },
            ]}
          >
            Sisa Saldo Netto
          </Text>
          <Text
            style={[
              styles.summaryValue,
              { fontWeight: "bold", color: "#1a5f7a" },
            ]}
          >
            {formatRupiah(saldo)}
          </Text>
        </View>
      </View>

      {/* SEKSI GRAFIK / PERSENTASE KATEGORI */}
      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>Alokasi Pengeluaran Terbesar</Text>

        {categoryData.length === 0 ? (
          <View style={styles.emptyReport}>
            <Ionicons name="bar-chart-outline" size={44} color="#bdc3c7" />
            <Text style={styles.emptyText}>
              Belum ada data pengeluaran untuk dianalisis.
            </Text>
          </View>
        ) : (
          categoryData.map((item, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.itemHeader}>
                <View style={styles.itemLeft}>
                  <Ionicons
                    name={getCategoryIcon(item.kategori)}
                    size={18}
                    color="#555"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.categoryName}>{item.kategori}</Text>
                </View>
                <Text style={styles.categoryTotal}>
                  {formatRupiah(item.total)}
                </Text>
              </View>

              <View style={styles.categoryTrack}>
                <View
                  style={[
                    styles.categoryBarFilled,
                    { width: `${item.persentase}%` },
                  ]}
                />
              </View>
              <Text style={styles.categoryPercentage}>
                {item.persentase.toFixed(1)}% dari total pengeluaran
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
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
    marginBottom: 20,
  },
  healthCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2ebd5",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  healthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  healthLabel: { fontSize: 13, color: "#555", fontWeight: "500" },
  healthStatusText: { fontSize: 14, fontWeight: "bold" },
  progressTrack: {
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBarFilled: { height: "100%", borderRadius: 5 },
  progressInfo: { fontSize: 12, color: "#7f8c8d", lineHeight: 18 },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2ebd5",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, color: "#555" },
  summaryValue: { fontSize: 15, fontWeight: "600" },
  reportSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2ebd5",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a5f7a",
    marginBottom: 20,
  },
  categoryItem: { marginBottom: 18 },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  categoryName: { fontSize: 14, fontWeight: "600", color: "#2c3e50" },
  categoryTotal: { fontSize: 14, fontWeight: "bold", color: "#333" },
  categoryTrack: {
    height: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 3,
    overflow: "hidden",
  },
  categoryBarFilled: {
    height: "100%",
    backgroundColor: "#1a5f7a",
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 11,
    color: "#95a5a6",
    marginTop: 4,
    textAlign: "right",
  },
  emptyReport: { alignItems: "center", paddingVertical: 40 },
  emptyText: {
    color: "#95a5a6",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },
});
