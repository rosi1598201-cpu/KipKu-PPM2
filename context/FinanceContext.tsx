import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../config/firebase";
import { FinanceContextType, Transaction, UserProfile } from "../types";

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fungsi menghitung total saldo secara aman
  const getFinancialSummary = () => {
    let pemasukan = 0;
    let pengeluaran = 0;

    transactions.forEach((t) => {
      const nominalAman = isNaN(Number(t.nominal)) ? 0 : Number(t.nominal);
      if (t.type === "pemasukan") {
        pemasukan += nominalAman;
      } else {
        pengeluaran += nominalAman;
      }
    });

    return {
      totalPemasukan: pemasukan,
      totalPengeluaran: pengeluaran,
      saldo: pemasukan - pengeluaran,
    };
  };

  useEffect(() => {
    // Referensi fungsi pemutus agar bisa diakses di luar scope auth
    let unsubscribeUser: (() => void) | null = null;
    let unsubscribeTransactions: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        console.log("=============== SYNC START ===============");
        console.log("User terdeteksi aktif dengan UID:", firebaseUser.uid);

        // 1. Sinkronisasi Data Profil Mahasiswa secara Real-time
        const userDocRef = doc(db, "users", firebaseUser.uid);
        unsubscribeUser = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUser({
                nama: data.nama || "",
                nim: data.nim || "",
                kampus: data.kampus || "",
                isKipK: data.isKipK || false,
                email: data.email || firebaseUser.email,
              });
            } else {
              setUser(null);
            }
          },
          (err) => {
            // Hanya tampilkan eror jika user memang masih login resmi di aplikasi
            if (auth.currentUser) {
              console.error("Gagal sinkronisasi profil:", err);
            }
          },
        );

        // 2. Sinkronisasi Data Transaksi secara Real-time
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", firebaseUser.uid),
        );

        unsubscribeTransactions = onSnapshot(
          q,
          (snapshot) => {
            const transList: Transaction[] = [];

            snapshot.forEach((doc) => {
              const data = doc.data();
              const nominalBersih =
                data.nominal === null || isNaN(Number(data.nominal))
                  ? 0
                  : Number(data.nominal);

              transList.push({
                id: doc.id,
                ...data,
                nominal: nominalBersih,
              } as Transaction);
            });

            // Logika pengurutan pintar (Data terbaru ditaruh paling atas)
            transList.sort((a, b) => {
              const dateA = a.tanggal ? a.tanggal.split("T")[0] : "";
              const dateB = b.tanggal ? b.tanggal.split("T")[0] : "";

              if (dateA !== dateB) {
                return new Date(dateB).getTime() - new Date(dateA).getTime();
              }

              if (a.tanggal && b.tanggal) {
                return b.tanggal.localeCompare(a.tanggal);
              }

              return 0;
            });

            setTransactions(transList);
            setLoading(false);
          },
          (error) => {
            if (auth.currentUser) {
              console.error("Gagal sinkronisasi transaksi:", error);
            }
            setLoading(false);
          },
        );
      } else {
        // 🚪 PROSES AMAN KETIKA LOG OUT: Putuskan listener database terlebih dahulu sebelum menghapus state
        if (unsubscribeUser) {
          unsubscribeUser();
          unsubscribeUser = null;
        }
        if (unsubscribeTransactions) {
          unsubscribeTransactions();
          unsubscribeTransactions = null;
        }

        setUser(null);
        setTransactions([]);
        setLoading(false);
        console.log(
          "Sesi berakhir. Semua listener database ditutup dengan aman.",
        );
        console.log("=============== SYNC STOP ===============");
      }
    });

    // Jalankan ini saat komponen dihancurkan (unmount)
    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeTransactions) unsubscribeTransactions();
    };
  }, []);

  const addTransaction = async (trans: Omit<Transaction, "id" | "userId">) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "transactions"), {
        ...trans,
        userId: auth.currentUser.uid,
      });
      console.log("Transaksi baru berhasil didorong ke Firestore.");
    } catch (e) {
      console.error("Gagal mendorong transaksi ke Firestore: ", e);
      throw e;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        user,
        setUser,
        transactions,
        addTransaction,
        getFinancialSummary,
        loading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context)
    throw new Error("useFinance harus digunakan di dalam FinanceProvider");
  return context;
};
