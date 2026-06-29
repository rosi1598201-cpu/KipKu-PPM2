import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../../config/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Semua kolom harus diisi!");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Login Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* BAGIAN LOGO & HEADER */}
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/images/logo.png")} // Sesuaikan dengan jalur & nama file logo Anda
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          Fin<Text style={styles.titleHighlight}>Mahasiswa</Text>
        </Text>
        <Text style={styles.subtitle}>
          Pencatatan Keuangan Mahasiswa & KIP-K
        </Text>
      </View>

      {/* BAGIAN FORM INPUT */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#a0a0a0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#a0a0a0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* TOMBOL MASUK (Kombinasi Biru) */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Masuk</Text>
          )}
        </TouchableOpacity>

        {/* LINK DAFTAR (Kombinasi Hijau Tanaman) */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            Belum punya akun?{" "}
            <Text style={styles.linkTextBold}>Daftar disini</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9fbf9", // Background putih bersih dengan sedikit hint hijau segar
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1a5f7a", // Biru gelap yang elegan
    textAlign: "center",
  },
  titleHighlight: {
    color: "#2d7a4d", // Hijau tanaman/daun segar
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
    borderColor: "#e2ebd5", // Border dengan sentuhan hijau tipis
    fontSize: 16,
    color: "#2c3e50",
    // Efek shadow halus agar terlihat modern
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    backgroundColor: "#1a5f7a", // Utama: Biru Elegan
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    height: 54,
    justifyContent: "center",
    shadowColor: "#1a5f7a",
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
  },
  linkText: {
    color: "#555",
    fontSize: 14,
  },
  linkTextBold: {
    color: "#2d7a4d", // Aksen: Hijau tanaman
    fontWeight: "bold",
  },
});
