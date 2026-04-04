import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowSquareOut,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  ArrowsLeftRight,
  Lightning,
  SignIn,
} from "@phosphor-icons/react";
import { useQuery } from "@animaapp/playground-react-sdk";
import { useApp } from "../context/AppContext";

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  buy: { label: "Purchase", icon: ArrowDown, color: "text-success" },
  sell: { label: "Sale", icon: ArrowUp, color: "text-error" },
  yield: { label: "Yield", icon: Lightning, color: "text-cyan" },
  transfer: { label: "Transfer", icon: ArrowsLeftRight, color: "text-accent" },
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  confirmed: { label: "Confirmed", icon: CheckCircle, className: "bg-success/20 text-success border-success/30" },
  pending: { label: "Pending", icon: Clock, className: "bg-warning/20 text-warning border-warning/30" },
  failed: { label: "Failed", icon: XCircle, className: "bg-error/20 text-error border-error/30" },
};

function TxRow({ tx, index }: { tx: any; index: number }) {
  const [copied, setCopied] = useState(false);
  const type = typeConfig[tx.type] ?? typeConfig.transfer;
  const status = statusConfig[tx.status] ?? statusConfig.pending;
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;

  const copyHash = () => {
    navigator.clipboard.writeText(tx.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortHash = tx.txHash
    ? `${tx.txHash.slice(0, 10)}...${tx.txHash.slice(-8)}`
    : "—";
  const date = new Date(tx.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-card border border-border-subtle rounded-lg"
    >
      <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-1 shrink-0 md:w-32">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-muted ${type.color}`}>
          <TypeIcon size={18} weight="duotone" />
        </div>
        <div className="md:text-right">
          <p className="text-caption font-mono text-muted-foreground">{date.toLocaleDateString()}</p>
          <p className="text-caption font-mono text-muted-foreground">
            {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-body font-body text-foreground">{type.label}</span>
          <span className={`text-caption font-body px-2 py-0.5 rounded border ${status.className} flex items-center gap-1`}>
            <StatusIcon size={12} weight="duotone" />
            {status.label}
          </span>
        </div>
        <p className="text-body-sm font-body text-muted-foreground truncate">{tx.propertyName}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-caption font-mono text-muted-foreground truncate">{shortHash}</p>
          <button
            onClick={copyHash}
            className="text-muted-foreground hover:text-cyan transition-colors cursor-pointer shrink-0"
            aria-label="Copy transaction hash"
          >
            {copied ? (
              <CheckCircle size={14} weight="duotone" className="text-success" />
            ) : (
              <Copy size={14} weight="duotone" />
            )}
          </button>
          {tx.txHash && (
            <a
              href={`https://etherscan.io/tx/${tx.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-cyan transition-colors cursor-pointer shrink-0"
            >
              <ArrowSquareOut size={14} weight="duotone" />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 shrink-0">
        <div>
          <p className="text-caption font-body text-muted-foreground">Amount</p>
          <p className={`text-body-sm font-mono ${type.color}`}>
            {tx.type === "buy" ? "-" : "+"} ${(tx.amount ?? 0).toLocaleString()}
          </p>
        </div>
        {(tx.tokens ?? 0) > 0 && (
          <div>
            <p className="text-caption font-body text-muted-foreground">Tokens</p>
            <p className="text-body-sm font-mono text-foreground">{tx.tokens}</p>
          </div>
        )}
        <div>
          <p className="text-caption font-body text-muted-foreground">Network</p>
          <p className="text-body-sm font-body text-foreground">{tx.network}</p>
        </div>
        {(tx.confirmations ?? 0) > 0 && (
          <div>
            <p className="text-caption font-body text-muted-foreground">Confirms</p>
            <p className="text-body-sm font-mono text-success">{tx.confirmations}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Transactions() {
  const { isAnonymous } = useApp();
  const [filter, setFilter] = useState<"all" | "buy" | "sell" | "yield" | "transfer">("all");

  const { data: transactions, isPending } = useQuery("Transaction", {
    orderBy: { createdAt: "desc" },
  });

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
            <ArrowsLeftRight size={40} weight="duotone" className="text-foreground" />
          </div>
          <h2 className="text-h2 font-sans text-foreground mb-3">Sign In to View Transactions</h2>
          <p className="text-body font-body text-muted-foreground mb-8">
            All your blockchain-verified transaction history will appear here once you&#39;re signed in.
          </p>
          <a
            href="/auth"
            className="w-full h-12 rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <SignIn size={18} weight="duotone" />
            Sign In / Sign Up
          </a>
        </motion.div>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="min-h-screen pt-[72px] pb-20 md:pb-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
          <p className="text-body-sm font-body text-muted-foreground">Loading transactions...</p>
        </div>
      </main>
    );
  }

  const allTx = transactions ?? [];
  const filtered = filter === "all" ? allTx : allTx.filter((t) => t.type === filter);

  return (
    <main className="min-h-screen pt-[72px] pb-20 md:pb-8">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-h1 font-sans text-foreground mb-2">Transaction History</h1>
          <p className="text-body font-body text-muted-foreground mb-8">
            All blockchain-verified transactions for your account.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["all", "buy", "sell", "yield", "transfer"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 h-9 rounded-md text-body-sm font-body transition-colors cursor-pointer
                  ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border-subtle text-muted-foreground hover:text-foreground hover:border-cyan"}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Transactions", value: allTx.length },
              { label: "Confirmed", value: allTx.filter((t) => t.status === "confirmed").length },
              { label: "Pending", value: allTx.filter((t) => t.status === "pending").length },
              { label: "Failed", value: allTx.filter((t) => t.status === "failed").length },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-border-subtle rounded-lg p-4">
                <p className="text-caption font-body text-muted-foreground mb-1">{label}</p>
                <p className="text-h3 font-mono text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* Transaction List */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border-subtle rounded-lg">
              <ArrowsLeftRight size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-h3 font-sans text-foreground mb-2">No Transactions</h3>
              <p className="text-body font-body text-muted-foreground">
                No transactions match the selected filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((tx, i) => (
                <TxRow key={tx.id} tx={tx} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
