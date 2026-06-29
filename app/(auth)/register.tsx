import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../../config/firebase";

export default function Register() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [kampus, setKampus] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isKipK, setIsKipK] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nama || !nim || !kampus || !email || !password) {
      Alert.alert("Error", "Semua data wajib diisi!");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;

      // Menyimpan data tambahan mahasiswa ke Firestore
      await setDoc(doc(db, "users", uid), {
        nama,
        nim,
        kampus,
        isKipK,
        email,
      });

      Alert.alert("Sukses", "Akun berhasil dibuat!", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (error: any) {
      Alert.alert("Registrasi Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          Daftar <Text style={styles.titleHighlight}>Akun</Text>
        </Text>
        <Text style={styles.subtitle}>
          Lengkapi data dirimu untuk mulai mencatat
        </Text>
      </View>

      {/* FORM INPUT */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          placeholderTextColor="#a0a0a0"
          value={nama}
          onChangeText={setNama}
        />
        <TextInput
          style={styles.input}
          placeholder="NIM"
          placeholderTextColor="#a0a0a0"
          keyboardType="numeric"
          value={nim}
          onChangeText={setNim}
        />
        <TextInput
          style={styles.input}
          placeholder="Perguruan Tinggi / Kampus"
          placeholderTextColor="#a0a0a0"
          value={kampus}
          onChangeText={setKampus}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#a0a0a0"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#a0a0a0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* TOGGLE SWITCH KIP-K (Aksen Hijau Tanaman) */}
        <View style={styles.switchContainer}>
          <View style={styles.switchTextWrapper}>
            <Text style={styles.switchLabel}>Mahasiswa Penerima KIP-K?</Text>
            <Text style={styles.switchSubLabel}>
              Aktifkan jika Anda menerima beasiswa
            </Text>
          </View>
          <Switch
            value={isKipK}
            onValueChange={setIsKipK}
            trackColor={{ false: "#767577", true: "#aedcc0" }}
            thumbColor={isKipK ? "#2d7a4d" : "#f4f3f4"}
          />
        </View>

        {/* TOMBOL DAFTAR (Kombinasi Hijau Tanaman) */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Daftar Sekarang</Text>
          )}
        </TouchableOpacity>

        {/* KEMBALI KE LOGIN */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            Sudah punya akun?{" "}
            <Text style={styles.linkTextBold}>Masuk disini</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9fbf9",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1a5f7a",
    textAlign: "center",
  },
  titleHighlight: {
    color: "#2d7a4d",
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 6,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2ebd5",
    fontSize: 16,
    color: "#2c3e50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2ebd5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  switchTextWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a5f7a",
  },
  switchSubLabel: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#2d7a4d", // Tombol utama daftar menggunakan Hijau Tanaman agar kontras dengan Login (Biru)
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
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  linkButton: {
    marginTop: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  linkText: {
    color: "#555",
    fontSize: 14,
  },
  linkTextBold: {
    color: "#1a5f7a", // Link menggunakan Biru
    fontWeight: "bold",
  },
});
