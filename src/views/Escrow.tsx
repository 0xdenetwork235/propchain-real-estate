import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  Clock,
  CheckCircle,
  Lock,
  LockOpen,
  Warning,
  ArrowRight,
  ShieldCheck,
  SignIn,
  Buildings,
  CurrencyDollar,
  CalendarCheck,
  SealCheck,
} from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

type EscrowStatus = "active" | "released" | "disputed" | "pending";

interface EscrowAgreement {
  id: string;
  property: string;
  city: string;
  type: "security_deposit" | "rental_escrow" | "purchase_escrow";
  amount: number;
  currency: string;
  tenant: string;
  landlord: string;
  startDate: Date;
  releaseDate: Date;
  status: EscrowStatus;
  conditions: string[];
  txHash: string;
  network: string;
  smartContract: string;
}

const MOCK_ESCROWS: EscrowAgreement[] = [
  {
    id: "e1",
    property: "Marina Bay Residences",
    city: "Singapore",
    type: "security_deposit",
    amount: 9600,
    currency: "USDC",
    tenant: "0x4f3a...b8d2",
    landlord: "0x9c12...a441",
    startDate: new Date("2025-01-01"),
    releaseDate: new Date("2025-12-31"),
    status: "active",
    conditions: ["No property damage", "Rent paid in full", "30-day notice given"],
    txHash: "0xabc123def456",
    network: "Polygon",
    smartContract: "0x1234...5678",
  },
  {
    id: "e2",
    property: "London Canary Wharf",
    city: "London",
    type: "rental_escrow",
    amount: 5200,
    currency: "USDC",
    tenant: "0x7e8b...f3a9",
    landlord: "0x3d5c...e027",
    startDate: new Date("2025-02-15"),
    releaseDate: new Date("2025-03-15"),
    status: "released",
    conditions: ["Monthly rent received", "Maintenance completed"],
    txHash: "0xdef789abc012",
    network: "Ethereum",
    smartContract: "0x9abc...def0",
  },
  {
    id: "e3",
    property: "Dubai Marina Tower",
    city: "Dubai",
    type: "purchase_escrow",
    amount: 120000,
    currency: "USDC",
    tenant: "0x2a9d...c7f1",
    landlord: "0x6b4e...8830",
    startDate: new Date("2025-03-01"),
    releaseDate: new Date("2025-06-01"),
    status: "disputed",
    conditions: ["Title transfer complete", "Inspection passed", "Legal clearance"],
    txHash: "0x345678901234",
    network: "Ethereum",
    smartContract: "0xef01...2345",
  },
  {
    id: "e4",
    property: "Tokyo Skyline Apartments",
    city: "Tokyo",
    type: "security_deposit",
    amount: 4800,
    currency: "USDC",
    tenant: "0xb3c2...117a",
    landlord: "0x5f6e...9d3b",
    startDate: new Date("2025-04-01"),
    releaseDate: new Date("2026-03-31"),
    status: "pending",
    conditions: ["Lease signed on-chain", "Wallet verification"],
    txHash: "",
    network: "Polygon",
    smartContract: "0x6789...abcd",
  },
];

const TYPE_LABEL: Record<string, string> = {
  security_deposit: "Security Deposit",
  rental_escrow: "Rental Escrow",
  purchase_escrow: "Purchase Escrow",
};

const STATUS_CONFIG: Record<EscrowStatus, { icon: React.ElementType; className: string; label: string; dotColor: string }> = {
  active: { icon: Lock, className: "bg-cyan/20 text-cyan border-cyan/30", label: "Active", dotColor: "bg-cyan" },
  released: { icon: LockOpen, className: "bg-success/20 text-success border-success/30", label: "Released", dotColor: "bg-success" },
  disputed: { icon: Warning, className: "bg-error/20 text-error border-error/30", label: "Disputed", dotColor: "bg-error" },
  pending: { icon: Clock, className: "bg-warning/20 text-warning border-warning/30", label: "Pending", dotColor: "bg-warning" },
};

export default function Escrow() {
  const { isAnonymous } = useApp();
  const [activeFilter, setActiveFilter] = useState<"all" | EscrowStatus>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isAnonymous) {
    return (
      <main className="min-h-screen pt-[72px] pb-20 md:pb-8 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
            <Handshake size={40} weight="duotone" className="text-foreground" />
          </div>
          <h2 className="text-h2 font-sans text-foreground mb-3">Sign In to View Escrow</h2>
          <p className="text-body font-body text-muted-foreground mb-8">
            Manage smart-contract escrow agreements, security deposits, and automated release conditions.
          </p>
          <Link to="/auth" className="w-full h-12 rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <SignIn size={18} weight="duotone" />
            Sign In / Sign Up
          </Link>
        </motion.div>
      </main>
    );
  }

  const filtered = activeFilter === "all" ? MOCK_ESCROWS : MOCK_ESCROWS.filter((e) => e.status === activeFilter);
  const totalLocked = MOCK_ESCROWS.filter((e) => e.status === "active" || e.status === "pending").reduce((s, e) => s + e.amount, 0);
  const totalReleased = MOCK_ESCROWS.filter((e) => e.status === "released").reduce((s, e) => s + e.amount, 0);

  return (
    <main className="min-h-screen pt-[72px] pb-20 md:pb-8">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-h1 font-sans text-foreground mb-2">Escrow & Deposits</h1>
            <p className="text-body font-body text-muted-foreground">
              Smart-contract-powered escrow agreements with programmable release conditions.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Locked", value: `$${totalLocked.toLocaleString()}`, sub: "Active escrows", icon: Lock, color: "text-cyan" },
              { label: "Total Released", value: `$${totalReleased.toLocaleString()}`, sub: "Completed agreements", icon: LockOpen, color: "text-success" },
              { label: "Active Agreements", value: MOCK_ESCROWS.filter((e) => e.status === "active").length, sub: "Currently running", icon: ShieldCheck, color: "text-accent" },
              { label: "Under Dispute", value: MOCK_ESCROWS.filter((e) => e.status === "disputed").length, sub: "Awaiting resolution", icon: Warning, color: "text-error" },
            ].map(({ label, value, sub, icon: Icon, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-card border border-border-subtle rounded-lg p-5">
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
            {(["all", "active", "pending", "released", "disputed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 h-9 rounded-md text-body-sm font-body transition-colors cursor-pointer capitalize ${activeFilter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border-subtle text-muted-foreground hover:text-foreground hover:border-cyan"}`}
              >
                {f === "all" ? "All Agreements" : f}
              </button>
            ))}
          </div>

          {/* Escrow Cards */}
          <div className="space-y-4">
            {filtered.map((escrow, i) => {
              const statusConf = STATUS_CONFIG[escrow.status];
              const StatusIcon = statusConf.icon;
              const isExpanded = expanded === escrow.id;
              const releaseProgress = Math.min(
                100,
                ((Date.now() - escrow.startDate.getTime()) / (escrow.releaseDate.getTime() - escrow.startDate.getTime())) * 100
              );

              return (
                <motion.div
                  key={escrow.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border-subtle rounded-xl overflow-hidden"
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : escrow.id)}
                    className="w-full text-left p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Buildings size={20} weight="duotone" className="text-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-body font-sans text-foreground">{escrow.property}</span>
                        <span className={`text-caption font-body px-2 py-0.5 rounded border flex items-center gap-1 ${statusConf.className}`}>
                          <StatusIcon size={11} weight="duotone" />
                          {statusConf.label}
                        </span>
                      </div>
                      <p className="text-body-sm font-body text-muted-foreground">{escrow.city} · {TYPE_LABEL[escrow.type]} · {escrow.network}</p>
                    </div>
                    <div className="flex gap-6 shrink-0">
                      <div>
                        <p className="text-caption font-body text-muted-foreground">Locked</p>
                        <p className="text-body-sm font-mono text-cyan">${escrow.amount.toLocaleString()} {escrow.currency}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-caption font-body text-muted-foreground">Release</p>
                        <p className="text-body-sm font-body text-foreground">{escrow.releaseDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ArrowRight size={18} weight="duotone" className={`text-muted-foreground transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
                  </button>

                  {/* Timeline Progress */}
                  {escrow.status === "active" && (
                    <div className="px-5 pb-3">
                      <div className="flex justify-between text-caption font-body text-muted-foreground mb-1">
                        <span>{escrow.startDate.toLocaleDateString()}</span>
                        <span>{Math.round(releaseProgress)}% elapsed</span>
                        <span>{escrow.releaseDate.toLocaleDateString()}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-cyan rounded-full transition-all" style={{ width: `${releaseProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border-subtle px-5 py-5 space-y-5"
                    >
                      {/* Parties */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-caption font-body text-muted-foreground mb-1">Tenant / Depositor</p>
                          <p className="text-body-sm font-mono text-foreground">{escrow.tenant}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-caption font-body text-muted-foreground mb-1">Landlord / Beneficiary</p>
                          <p className="text-body-sm font-mono text-foreground">{escrow.landlord}</p>
                        </div>
                      </div>

                      {/* Release Conditions */}
                      <div>
                        <p className="text-body-sm font-body text-muted-foreground mb-3 flex items-center gap-1.5">
                          <SealCheck size={14} weight="duotone" className="text-cyan" />
                          Release Conditions
                        </p>
                        <div className="space-y-2">
                          {escrow.conditions.map((cond, ci) => (
                            <div key={ci} className="flex items-center gap-3 text-body-sm font-body text-foreground">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${escrow.status === "released" ? "bg-success/20" : "bg-muted"}`}>
                                {escrow.status === "released" ? (
                                  <CheckCircle size={12} weight="duotone" className="text-success" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                                )}
                              </div>
                              {cond}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Smart Contract */}
                      <div className="flex flex-wrap gap-4 pt-2 border-t border-border-subtle">
                        <div>
                          <p className="text-caption font-body text-muted-foreground">Smart Contract</p>
                          <p className="text-body-sm font-mono text-muted-foreground">{escrow.smartContract}</p>
                        </div>
                        {escrow.txHash && (
                          <div>
                            <p className="text-caption font-body text-muted-foreground">Tx Hash</p>
                            <p className="text-body-sm font-mono text-muted-foreground">{escrow.txHash}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {escrow.status === "active" && (
                        <div className="flex gap-3 pt-1">
                          <button className="flex items-center gap-2 px-4 h-9 rounded-md bg-success/20 text-success border border-success/30 text-body-sm font-body hover:bg-success/30 transition-colors cursor-pointer">
                            <LockOpen size={14} weight="duotone" />
                            Initiate Release
                          </button>
                          <button className="flex items-center gap-2 px-4 h-9 rounded-md border border-border-subtle text-muted-foreground text-body-sm font-body hover:text-foreground transition-colors cursor-pointer">
                            <Warning size={14} weight="duotone" />
                            Raise Dispute
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* How it Works */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 p-6 rounded-xl border border-border-subtle bg-card">
            <h3 className="text-h3 font-sans text-foreground mb-5 flex items-center gap-2">
              <ShieldCheck size={20} weight="duotone" className="text-cyan" />
              How Smart Escrow Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Funds Locked", desc: "Deposit is locked on-chain via smart contract. Neither party controls the funds during the agreement period.", icon: Lock },
                { step: "02", title: "Conditions Met", desc: "The smart contract monitors release conditions — rent payments, inspection results, or time-based triggers.", icon: CalendarCheck },
                { step: "03", title: "Auto Release", desc: "When all conditions are satisfied, funds are released automatically without any intermediary or delay.", icon: LockOpen },
              ].map(({ step, title, desc, icon: Icon }) => (
                <div key={step} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-caption font-mono text-muted-foreground">{step}</span>
                    <Icon size={18} weight="duotone" className="text-cyan" />
                    <span className="text-body font-sans text-foreground">{title}</span>
                  </div>
                  <p className="text-body-sm font-body text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}
