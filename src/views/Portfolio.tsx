import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendUp,
  Coins,
  ArrowsClockwise,
  ArrowUp,
  ArrowSquareOut,
  Wallet,
  SignIn,
} from "@phosphor-icons/react";
import { useQuery } from "@animaapp/playground-react-sdk";
import { useApp } from "../context/AppContext";
import { mockProperties } from "../data/mockData";

export default function Portfolio() {
  const { wallet, setWalletModalOpen, addToast, authUser, isAnonymous } = useApp();
  const navigate = useNavigate();

  const { data: portfolio, isPending } = useQuery("PortfolioItem");

  // ── Not logged in ──────────────────────────────
  if (isAnonymous) {
    return (
      <main className="min-h-screen pt-[72px] pb-20 md:pb-8 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
            <SignIn size={40} weight="duotone" className="text-foreground" />
          </div>
          <h2 className="text-h2 font-sans text-foreground mb-3">Sign In to View Portfolio</h2>
          <p className="text-body font-body text-muted-foreground mb-8">
            Create a free account or sign in to track your tokenized real estate investments and yields.
          </p>
          <Link
            to="/auth"
            className="w-full h-12 rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2 mb-4"
          >
            <SignIn size={18} weight="duotone" />
            Sign In / Sign Up
          </Link>
          <p className="text-caption font-body text-muted-foreground">Free to join · No wallet required to browse</p>
        </motion.div>
      </main>
    );
  }

  // ── Loading ────────────────────────────────────
  if (isPending) {
    return (
      <main className="min-h-screen pt-[72px] pb-20 md:pb-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
          <p className="text-body-sm font-body text-muted-foreground">Loading portfolio...</p>
        </div>
      </main>
    );
  }

  const items = portfolio ?? [];

  const totalInvested = items.reduce(
    (sum, item) => sum + item.tokensOwned * item.purchasePrice,
    0,
  );
  const totalCurrentValue = items.reduce(
    (sum, item) => sum + item.tokensOwned * item.currentValue,
    0,
  );
  const totalYield = items.reduce((sum, item) => sum + item.yieldEarned, 0);
  const totalGain = totalCurrentValue - totalInvested;
  const gainPercent =
    totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(2) : "0.00";

  // ── Wallet not connected prompt ────────────────
  if (!wallet.connected && items.length === 0) {
    return (
      <main className="min-h-screen pt-[72px] pb-20 md:pb-8 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
            <Wallet size={40} weight="duotone" className="text-foreground" />
          </div>
          <h2 className="text-h2 font-sans text-foreground mb-3">Connect Your Wallet</h2>
          <p className="text-body font-body text-muted-foreground mb-8">
            Connect your wallet to view your portfolio, track yields, and manage your tokenized real estate investments.
          </p>
          <div className="bg-card border border-border-subtle rounded-lg p-5 mb-6 text-left">
            <p className="text-caption font-body text-muted-foreground mb-1">Signed in as</p>
            <p className="text-body-sm font-body text-foreground">{authUser?.email}</p>
          </div>
          <button
            onClick={() => setWalletModalOpen(true)}
            className="w-full h-12 rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Wallet size={18} weight="duotone" />
            Connect Wallet
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[72px] pb-20 md:pb-8">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-h1 font-sans text-foreground mb-2">My Portfolio</h1>
          <p className="text-body font-body text-muted-foreground mb-8">
            Track your tokenized real estate investments and yields.
          </p>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Total Invested", value: `$${totalInvested.toLocaleString()}`, sub: "Across all properties", color: "text-foreground", icon: Coins },
              { label: "Current Value", value: `$${totalCurrentValue.toLocaleString()}`, sub: `${gainPercent}% total gain`, color: "text-cyan", icon: TrendUp },
              { label: "Total Yield Earned", value: `$${totalYield.toLocaleString()}`, sub: "Lifetime distributions", color: "text-success", icon: ArrowUp },
              { label: "Unrealized Gain", value: `$${totalGain.toFixed(2)}`, sub: "Mark-to-market", color: totalGain >= 0 ? "text-success" : "text-error", icon: TrendUp },
            ].map(({ label, value, sub, color, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-card border border-border-subtle rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} weight="duotone" className={color} />
                  <span className="text-body-sm font-body text-muted-foreground">{label}</span>
                </div>
                <p className={`text-h3 font-mono ${color} mb-1`}>{value}</p>
                <p className="text-caption font-body text-muted-foreground">{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Holdings */}
          <h2 className="text-h2 font-sans text-foreground mb-6">Holdings</h2>
          {items.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border-subtle rounded-lg">
              <Coins size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-h3 font-sans text-foreground mb-2">No Holdings Yet</h3>
              <p className="text-body font-body text-muted-foreground mb-6">
                Start investing in tokenized properties to build your portfolio.
              </p>
              <button
                onClick={() => navigate("/marketplace")}
                className="px-6 h-11 rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body cursor-pointer hover:brightness-110 transition-all"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => {
                const property = mockProperties.find((p) => p.id === item.propertyId);
                if (!property) return null;
                const currentVal = item.tokensOwned * item.currentValue;
                const invested = item.tokensOwned * item.purchasePrice;
                const gain = currentVal - invested;
                const gainPct = ((gain / invested) * 100).toFixed(2);

                return (
                  <motion.div
                    key={item.propertyId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-card border border-border-subtle rounded-lg p-5 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <img
                      src={property.image}
                      alt={property.imageAlt}
                      loading="lazy"
                      className="w-full md:w-20 h-32 md:h-14 object-cover rounded-md shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body font-sans text-foreground truncate">{property.name}</h3>
                      <p className="text-body-sm font-body text-muted-foreground">{property.city} · {property.network}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      <div>
                        <p className="text-caption font-body text-muted-foreground">Tokens</p>
                        <p className="text-body-sm font-mono text-foreground">{item.tokensOwned}</p>
                      </div>
                      <div>
                        <p className="text-caption font-body text-muted-foreground">Value</p>
                        <p className="text-body-sm font-mono text-cyan">${currentVal.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-caption font-body text-muted-foreground">Gain</p>
                        <p className={`text-body-sm font-mono ${gain >= 0 ? "text-success" : "text-error"}`}>
                          {gain >= 0 ? "+" : ""}{gainPct}%
                        </p>
                      </div>
                      <div>
                        <p className="text-caption font-body text-muted-foreground">Yield</p>
                        <p className="text-body-sm font-mono text-success">+${item.yieldEarned}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => addToast({ type: "info", title: "Reinvest", description: "Reinvest feature coming soon." })}
                        className="flex items-center gap-1.5 px-3 h-9 rounded-md border border-border-subtle text-muted-foreground hover:text-foreground hover:border-cyan text-body-sm font-body transition-colors cursor-pointer"
                      >
                        <ArrowsClockwise size={14} weight="duotone" />
                        Reinvest
                      </button>
                      <button
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="flex items-center gap-1.5 px-3 h-9 rounded-md bg-muted text-foreground hover:bg-secondary text-body-sm font-body transition-colors cursor-pointer"
                      >
                        <ArrowSquareOut size={14} weight="duotone" />
                        View
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
