import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lightning,
  ArrowsLeftRight,
  Globe,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  CurrencyDollar,
  PaperPlaneTilt,
  Bank,
  Wallet,
  SignIn,
} from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

const MOCK_PAYMENTS = [
  {
    id: "p1",
    type: "rent_collection",
    label: "Rent Collection",
    property: "Marina Bay Residences",
    from: "Tenant · Singapore",
    to: "Landlord Escrow",
    amount: 3200,
    currency: "USDC",
    status: "confirmed",
    settled: true,
    network: "Polygon",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "p2",
    type: "cross_border",
    label: "Cross-Border Transfer",
    property: "Dubai Marina Tower",
    from: "Investor · UAE",
    to: "Property Fund · UK",
    amount: 15000,
    currency: "USDC",
    status: "confirmed",
    settled: true,
    network: "Ethereum",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: "p3",
    type: "rent_collection",
    label: "Rent Collection",
    property: "Tokyo Skyline Apartments",
    from: "Tenant · Japan",
    to: "Landlord Escrow",
    amount: 2800,
    currency: "USDC",
    status: "pending",
    settled: false,
    network: "Polygon",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "p4",
    type: "yield_distribution",
    label: "Yield Distribution",
    property: "London Canary Wharf",
    from: "Protocol",
    to: "Token Holders",
    amount: 8450,
    currency: "USDC",
    status: "confirmed",
    settled: true,
    network: "Ethereum",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "p5",
    type: "cross_border",
    label: "Cross-Border Transfer",
    property: "NYC Financial District",
    from: "Investor · EU",
    to: "Property Fund · USA",
    amount: 22000,
    currency: "USDC",
    status: "failed",
    settled: false,
    network: "Ethereum",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
];

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  rent_collection: { icon: Bank, color: "text-cyan", bg: "bg-cyan/10" },
  cross_border: { icon: Globe, color: "text-accent", bg: "bg-accent/10" },
  yield_distribution: { icon: Lightning, color: "text-success", bg: "bg-success/10" },
};

const STATUS_CONFIG: Record<string, { icon: React.ElementType; className: string; label: string }> = {
  confirmed: { icon: CheckCircle, className: "bg-success/20 text-success border-success/30", label: "Settled" },
  pending: { icon: Clock, className: "bg-warning/20 text-warning border-warning/30", label: "Pending" },
  failed: { icon: XCircle, className: "bg-error/20 text-error border-error/30", label: "Failed" },
};

export default function Payments() {
  const { isAnonymous } = useApp();
  const [filter, setFilter] = useState<"all" | "rent_collection" | "cross_border" | "yield_distribution">("all");
  const [showSend, setShowSend] = useState(false);
  const [sendForm, setSendForm] = useState({ recipient: "", amount: "", network: "Polygon", memo: "" });

  if (isAnonymous) {
    return (
      <main className="min-h-screen pt-[72px] pb-20 md:pb-8 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
            <Lightning size={40} weight="duotone" className="text-foreground" />
          </div>
          <h2 className="text-h2 font-sans text-foreground mb-3">Sign In to Access Payments</h2>
          <p className="text-body font-body text-muted-foreground mb-8">
            Instant rent settlements, cross-border transfers, and yield distributions — all in one place.
          </p>
          <Link to="/auth" className="w-full h-12 rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <SignIn size={18} weight="duotone" />
            Sign In / Sign Up
          </Link>
        </motion.div>
      </main>
    );
  }

  const filtered = filter === "all" ? MOCK_PAYMENTS : MOCK_PAYMENTS.filter((p) => p.type === filter);
  const totalSettled = MOCK_PAYMENTS.filter((p) => p.status === "confirmed").reduce((s, p) => s + p.amount, 0);
  const totalPending = MOCK_PAYMENTS.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const crossBorderCount = MOCK_PAYMENTS.filter((p) => p.type === "cross_border").length;

  return (
    <main className="min-h-screen pt-[72px] pb-20 md:pb-8">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-h1 font-sans text-foreground mb-2">Payments Hub</h1>
              <p className="text-body font-body text-muted-foreground">
                Instant rent settlements, cross-border transfers, and yield distributions.
              </p>
            </div>
            <button
              onClick={() => setShowSend(!showSend)}
              className="flex items-center gap-2 px-5 h-11 rounded-md bg-gradient-primary text-primary-foreground font-body text-body hover:brightness-110 transition-all cursor-pointer shrink-0"
            >
              <PaperPlaneTilt size={18} weight="duotone" />
              Send Payment
            </button>
          </div>

          {/* Send Payment Panel */}
          {showSend && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border-subtle rounded-xl p-6 mb-8"
            >
              <h3 className="text-h3 font-sans text-foreground mb-4">New Payment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Recipient Address or ENS</label>
                  <input
                    value={sendForm.recipient}
                    onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                    placeholder="0x... or landlord.eth"
                    className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan"
                  />
                </div>
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Amount (USDC)</label>
                  <input
                    value={sendForm.amount}
                    onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                    placeholder="0.00"
                    type="number"
                    className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan"
                  />
                </div>
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Network</label>
                  <select
                    value={sendForm.network}
                    onChange={(e) => setSendForm({ ...sendForm, network: e.target.value })}
                    className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-body text-foreground focus:outline-none focus:border-cyan"
                  >
                    <option>Polygon</option>
                    <option>Ethereum</option>
                    <option>Arbitrum</option>
                    <option>Base</option>
                  </select>
                </div>
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Memo (optional)</label>
                  <input
                    value={sendForm.memo}
                    onChange={(e) => setSendForm({ ...sendForm, memo: e.target.value })}
                    placeholder="e.g. April rent - Unit 4B"
                    className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button className="flex items-center gap-2 px-6 h-11 rounded-md bg-gradient-primary text-primary-foreground font-body text-body hover:brightness-110 transition-all cursor-pointer">
                  <Lightning size={16} weight="duotone" />
                  Send Instantly
                </button>
                <button onClick={() => setShowSend(false)} className="px-5 h-11 rounded-md border border-border-subtle text-muted-foreground hover:text-foreground font-body text-body transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Settled (30d)", value: `$${totalSettled.toLocaleString()}`, sub: "USDC on-chain", icon: CheckCircle, color: "text-success" },
              { label: "Pending Settlement", value: `$${totalPending.toLocaleString()}`, sub: "Awaiting confirmation", icon: Clock, color: "text-warning" },
              { label: "Cross-Border Transfers", value: crossBorderCount, sub: "This month", icon: Globe, color: "text-accent" },
            ].map(({ label, value, sub, icon: Icon, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card border border-border-subtle rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={17} weight="duotone" className={color} />
                  <span className="text-caption font-body text-muted-foreground">{label}</span>
                </div>
                <p className={`text-h3 font-mono ${color} mb-0.5`}>{value}</p>
                <p className="text-caption font-body text-muted-foreground">{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: "all", label: "All Payments" },
              { key: "rent_collection", label: "Rent Collection" },
              { key: "cross_border", label: "Cross-Border" },
              { key: "yield_distribution", label: "Yield Distribution" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 h-9 rounded-md text-body-sm font-body transition-colors cursor-pointer ${filter === key ? "bg-primary text-primary-foreground" : "bg-card border border-border-subtle text-muted-foreground hover:text-foreground hover:border-cyan"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Payment List */}
          <div className="space-y-3">
            {filtered.map((payment, i) => {
              const typeConf = TYPE_CONFIG[payment.type] ?? TYPE_CONFIG.cross_border;
              const statusConf = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.pending;
              const TypeIcon = typeConf.icon;
              const StatusIcon = statusConf.icon;
              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card border border-border-subtle rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeConf.bg}`}>
                    <TypeIcon size={20} weight="duotone" className={typeConf.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-body font-body text-foreground">{payment.label}</span>
                      <span className={`text-caption font-body px-2 py-0.5 rounded border flex items-center gap-1 ${statusConf.className}`}>
                        <StatusIcon size={11} weight="duotone" />
                        {statusConf.label}
                      </span>
                    </div>
                    <p className="text-body-sm font-body text-muted-foreground truncate">{payment.property}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-caption font-body text-muted-foreground">
                      <span>{payment.from}</span>
                      <ArrowUpRight size={11} weight="duotone" />
                      <span>{payment.to}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-5 shrink-0">
                    <div>
                      <p className="text-caption font-body text-muted-foreground">Amount</p>
                      <p className={`text-body-sm font-mono ${typeConf.color}`}>${payment.amount.toLocaleString()} {payment.currency}</p>
                    </div>
                    <div>
                      <p className="text-caption font-body text-muted-foreground">Network</p>
                      <p className="text-body-sm font-body text-foreground">{payment.network}</p>
                    </div>
                    <div>
                      <p className="text-caption font-body text-muted-foreground">Time</p>
                      <p className="text-body-sm font-mono text-muted-foreground">
                        {payment.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Info Banner */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 p-5 rounded-xl border border-cyan/20 bg-cyan/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center shrink-0">
              <Wallet size={20} weight="duotone" className="text-cyan" />
            </div>
            <div className="flex-1">
              <p className="text-body font-body text-foreground mb-0.5">Connect your wallet to send live payments</p>
              <p className="text-body-sm font-body text-muted-foreground">All payments clear in seconds via USDC on Polygon or Ethereum — no banks, no delays.</p>
            </div>
            <Link to="/portfolio" className="flex items-center gap-2 px-4 h-10 rounded-md border border-cyan/40 text-cyan text-body-sm font-body hover:bg-cyan/10 transition-colors cursor-pointer shrink-0">
              <CurrencyDollar size={16} weight="duotone" />
              My Portfolio
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}
