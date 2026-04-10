import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import TopNav from "./components/layout/TopNav";
import BottomTabBar from "./components/layout/BottomTabBar";
import ToastLayer from "./components/layout/ToastLayer";
import CommandPalette from "./components/CommandPalette";
import WalletModal from "./components/WalletModal";
import Landing from "./views/Landing";
import Marketplace from "./views/Marketplace";
import PropertyDetail from "./views/PropertyDetail";
import Portfolio from "./views/Portfolio";
import Transactions from "./views/Transactions";
import Learn from "./views/Learn";
import AuthPage from "./views/AuthPage";
import Payments from "./views/Payments";
import Escrow from "./views/Escrow";
import Schedules from "./views/Schedules";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function KeyboardShortcuts() {
  const { setCommandPaletteOpen } = useApp();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);
  return null;
}

function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      <TopNav />
      <CommandPalette />
      <WalletModal />
      <ToastLayer />
      <KeyboardShortcuts />
      <ScrollToTop />

        <div id="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/escrow" element={<Escrow />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="*" element={<Navigate to="/marketplace" replace />} />
        </Routes>
      </div>

      <BottomTabBar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
