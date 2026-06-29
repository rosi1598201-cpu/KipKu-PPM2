export interface UserProfile {
  nama: string;
  nim: string;
  kampus: string;
  isKipK: boolean;
  email?: string;
}

export type TransactionType = "pemasukan" | "pengeluaran";

export interface Transaction {
  id: string;
  type: TransactionType;
  nominal: number;
  tanggal: string;
  keterangan: string;
  kategori: string;
  userId: string;
}

export interface FinanceContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  transactions: Transaction[];
  addTransaction: (trans: Omit<Transaction, "id" | "userId">) => Promise<void>;
  getFinancialSummary: () => {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldo: number;
  };
  loading: boolean;
}
