import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFinance } from "../../context/FinanceContext";

export default function AddIncome() {
  const { addTransaction } = useFinance();
  const router = useRouter();
  const [displayNominal, setDisplayNominal] = useState(""); // Menampilkan teks berformat (ex: 5.000.000)
  const [rawNominal, setRawNominal] = useState(""); // Menyimpan angka murni secara internal (ex: 5000000)
  const [keterangan, setKeterangan] = useState("");
  const [kategori, setKategori] = useState("Beasiswa KIP-K");
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Beasiswa KIP-K",
    "Kiriman Ortu",
    "Gaji Part-Time",
    "Sampingan",
    "Lainnya",
  ];

  // Fungsi interseptor untuk memformat input secara real-time
  const formatInputRupiah = (text: string) => {
    // Hapus semua karakter yang bukan angka (termasuk titik/koma yang diketik manual)
    const cleanNumber = text.replace(/[^0-9]/g, "");
    setRawNominal(cleanNumber);

    if (cleanNumber === "" || cleanNumber === "0") {
      setDisplayNominal("");
      return;
    }

    // Ubah menjadi format ribuan lokal Indonesia (dengan titik)
    const formatted = parseInt(cleanNumber, 10).toLocaleString("id-ID");
    setDisplayNominal(formatted);
  };

  const handleSave = async () => {
    // Jaring pengaman ganda: Ambil dari rawNominal, jika kosong bersihkan ulang teks displayNominal
    const finalCleanNumber = rawNominal
      ? rawNominal
      : displayNominal.replace(/[^0-9]/g, "");

    if (!finalCleanNumber) {
      Alert.alert("Form Belum Lengkap ⚠️", "Nominal pemasukan harus diisi!");
      return;
    }

    const parsedNominal = parseInt(finalCleanNumber, 10);

    if (isNaN(parsedNominal) || parsedNominal <= 0) {
      Alert.alert("Input Tidak Valid ❌", "Nominal harus lebih besar dari 0!");
      return;
    }

    setSubmitting(true);
    const today = new Date().toISOString().split("T")[0];

    try {
      await addTransaction({
        type: "pemasukan",
        nominal: parsedNominal, // Mengirimkan tipe data Number murni ke Firestore
        keterangan: keterangan || `Pemasukan ${kategori}`,
        tanggal: today,
        kategori,
      });

      Alert.alert("Sukses 🎉", "Pemasukan berhasil dicatat!", [
        {
          text: "Lihat Dashboard",
          onPress: () => {
            setDisplayNominal("");
            setRawNominal("");
            setKeterangan("");
            router.replace("/(tabs)");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Gagal ❌", "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5f7a" />

      <View style={styles.cardForm}>
        <Text style={styles.sectionHeader}>Catat Pemasukan Baru</Text>
        <Text style={styles.sectionSubtitle}>
          Mendukung input angka polos maupun format titik secara manual
        </Text>

        {/* INPUT NOMINAL */}
        <Text style={styles.label}>Nominal Uang (Rp)</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="wallet-outline"
            size={20}
            color="#2d7a4d"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Contoh: 5.000.000"
            placeholderTextColor="#a0a0a0"
            value={displayNominal}
            onChangeText={formatInputRupiah}
          />
        </View>

        {/* INPUT KETERANGAN */}
        <Text style={styles.label}>Keterangan / Sumber</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color="#7f8c8d"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Contoh: Pencairan KIP-K Semester Ini"
            placeholderTextColor="#a0a0a0"
            value={keterangan}
            onChangeText={setKeterangan}
          />
        </View>

        {/* PILIHAN KATEGORI */}
        <Text style={styles.label}>Pilih Kategori</Text>
        <View style={styles.catContainer}>
          {categories.map((cat) => {
            const isActive = kategori === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catBadge, isActive && styles.catBadgeActive]}
                onPress={() => setKategori(cat)}
              >
                <Ionicons
                  name={isActive ? "checkbox" : "ellipse-outline"}
                  size={14}
                  color={isActive ? "#fff" : "#7f8c8d"}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[styles.catText, isActive && styles.catTextActive]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TOMBOL SIMPAN */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonInner}>
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.buttonText}>Simpan Pemasukan</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fbf9", padding: 20 },
  cardForm: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2ebd5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: { fontSize: 18, fontWeight: "bold", color: "#1a5f7a" },
  sectionSubtitle: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
    marginBottom: 24,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#2c3e50", marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2ebd5",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: "#2c3e50" },
  catContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 28,
    marginTop: 4,
  },
  catBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  catBadgeActive: { backgroundColor: "#2d7a4d", borderColor: "#2d7a4d" },
  catText: { fontSize: 13, color: "#555", fontWeight: "500" },
  catTextActive: { color: "#fff", fontWeight: "600" },
  button: {
    backgroundColor: "#2d7a4d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    height: 54,
    justifyContent: "center",
    shadowColor: "#2d7a4d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 4,
  },
  buttonInner: { flexDirection: "row", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
