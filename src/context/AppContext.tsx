import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { WalletState } from "../types";

/* ── Auth types ────────────────────────────── */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

/* ── Toast types ───────────────────────────── */
interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
}

/* ── Context shape ─────────────────────────── */
interface AppContextType {
  /* auth */
  authUser: AuthUser | null;
  isAnonymous: boolean;
  authLoading: boolean;
  loginWithCode: (email: string, code: string) => Promise<void>;
  logoutUser: () => void;
  /* wallet */
  wallet: WalletState;
  connectWallet: (type: string) => void;
  disconnectWallet: () => void;
  /* toasts */
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  /* ui */
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  walletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (v: boolean) => void;
}

const STORAGE_KEY = "propchain_auth_user";
const VALID_CODE = "453269"; // demo: always accept this code

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  /* ── Auth state ──────────────────────────── */
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAuthUser(JSON.parse(raw));
    } catch (_) {}
    setAuthLoading(false);
  }, []);

  const loginWithCode = useCallback(
    async (email: string, code: string): Promise<void> => {
      // Accept VALID_CODE or any 6-digit numeric code for dev convenience
      const isValid = /^\d{6}$/.test(code) && code === VALID_CODE;
      if (!isValid) {
        throw new Error("Invalid or expired code. Use 123456 in dev mode.");
      }
      const user: AuthUser = {
        id: `user_${Date.now()}`,
        email,
        name: email.split("@")[0],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setAuthUser(user);
    },
    [],
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthUser(null);
  }, []);

  /* ── Wallet state ────────────────────────── */
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
    network: "Ethereum",
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const connectWallet = useCallback((type: string) => {
    setWallet({
      connected: true,
      address: "0x742d35Cc6634C0532925a3b8D4C9E2f3a4b5c6d7",
      balance: 12450.75,
      network: "Ethereum",
    });
    setWalletModalOpen(false);
    addToast({
      type: "success",
      title: "Wallet Connected",
      description: `Connected via ${type}`,
    });
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      connected: false,
      address: null,
      balance: 0,
      network: "Ethereum",
    });
    addToast({ type: "info", title: "Wallet Disconnected" });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        authUser,
        isAnonymous: !authUser,
        authLoading,
        loginWithCode,
        logoutUser,
        wallet,
        connectWallet,
        disconnectWallet,
        toasts,
        addToast,
        removeToast,
        commandPaletteOpen,
        setCommandPaletteOpen,
        walletModalOpen,
        setWalletModalOpen,
        onboardingComplete,
        setOnboardingComplete,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
