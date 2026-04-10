import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  Lightning,
  ArrowsClockwise,
  Plus,
  SignIn,
  Buildings,
  Pause,
  Play,
  CurrencyDollar,
  SealCheck,
  Warning,
  Funnel,
} from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

type ScheduleStatus = "active" | "paused" | "completed" | "upcoming";
type Frequency = "monthly" | "weekly" | "quarterly" | "biannual";

interface PaymentSchedule {
  id: string;
  property: string;
  city: string;
  type: "rent" | "yield" | "mortgage" | "maintenance";
  amount: number;
  currency: string;
  frequency: Frequency;
  nextPayment: Date;
  lastPayment: Date | null;
  totalPaid: number;
  totalPayments: number;
  completedPayments: number;
  status: ScheduleStatus;
  smartContract: string;
  network: string;
  recipient: string;
}

const MOCK_SCHEDULES: PaymentSchedule[] = [
  {
    id: "s1",
    property: "Marina Bay Residences",
    city: "Singapore",
    type: "rent",
    amount: 3200,
    currency: "USDC",
    frequency: "monthly",
    nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
    lastPayment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22),
    totalPaid: 38400,
    totalPayments: 24,
    completedPayments: 12,
    status: "active",
    smartContract: "0x1234...5678",
    network: "Polygon",
    recipient: "0xLandlord...a441",
  },
  {
    id: "s2",
    property: "London Canary Wharf",
    city: "London",
    type: "yield",
    amount: 1250,
    currency: "USDC",
    frequency: "monthly",
    nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    lastPayment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 27),
    totalPaid: 15000,
    totalPayments: 36,
    completedPayments: 12,
    status: "active",
    smartContract: "0xabcd...ef01",
    network: "Ethereum",
    recipient: "0xInvestors...pool",
  },
  {
    id: "s3",
    property: "Dubai Marina Tower",
    city: "Dubai",
    type: "mortgage",
    amount: 8500,
    currency: "USDC",
    frequency: "monthly",
    nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    lastPayment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    totalPaid: 102000,
    totalPayments: 240,
    completedPayments: 12,
    status: "paused",
    smartContract: "0x5678...9abc",
    network: "Ethereum",
    recipient: "0xMortgage...fund",
  },
  {
    id: "s4",
    property: "Tokyo Skyline Apartments",
    city: "Tokyo",
    type: "rent",
    amount: 2800,
    currency: "USDC",
    frequency: "monthly",
    nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
    lastPayment: null,
    totalPaid: 0,
    totalPayments: 12,
    completedPayments: 0,
    status: "upcoming",
    smartContract: "0xef01...2345",
    network: "Polygon",
    recipient: "0xLandlord...3b9f",
  },
  {
    id: "s5",
    property: "NYC Financial District",
    city: "New York",
    type: "maintenance",
    amount: 450,
    currency: "USDC",
    frequency: "quarterly",
    nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
    lastPayment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    totalPaid: 1800,
    totalPayments: 20,
    completedPayments: 4,
    status: "completed",
    smartContract: "0x2345...6789",
    network: "Arbitrum",
    recipient: "0xMaintenance...svc",
  },
];

const TYPE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  rent: { color: "text-cyan", bg: "bg-cyan/10", label: "Rent" },
  yield: { color: "text-success", bg: "bg-success/10", label: "Yield" },
  mortgage: { color: "text-accent", bg: "bg-accent/10", label: "Mortgage" },
  maintenance: { color: "text-warning", bg: "bg-warning/10", label: "Maintenance" },
};

const STATUS_CONFIG: Record<ScheduleStatus, { icon: React.ElementType; className: string; label: string }> = {
  active: { icon: Lightning, className: "bg-cyan/20 text-cyan border-cyan/30", label: "Active" },
  paused: { icon: Pause, className: "bg-warning/20 text-warning border-warning/30", label: "Paused" },
  completed: { icon: CheckCircle, className: "bg-success/20 text-success border-success/30", label: "Completed" },
  upcoming: { icon: Clock, className: "bg-muted text-muted-foreground border-border-subtle", label: "Upcoming" },
};

const FREQ_LABEL: Record<Frequency, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  biannual: "Bi-annual",
};

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function Schedules() {
  const { isAnonymous } = useApp();
  const [filter, setFilter] = useState<"all" | ScheduleStatus>("all");
  const [showCreate, setShowCreate] = useState(false);

  if (isAnonymous) {
    return (
      <main className="min-h-screen pt-[72px] pb-20 md:pb-8 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
            <CalendarCheck size={40} weight="duotone" className="text-foreground" />
          </div>
          <h2 className="text-h2 font-sans text-foreground mb-3">Sign In to Manage Schedules</h2>
          <p className="text-body font-body text-muted-foreground mb-8">
            Configure programmable payment schedules powered by smart contracts — rents, yields, and mortgage disbursements.
          </p>
          <Link to="/auth" className="w-full h-12 rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <SignIn size={18} weight="duotone" />
            Sign In / Sign Up
          </Link>
        </motion.div>
      </main>
    );
  }

  const filtered = filter === "all" ? MOCK_SCHEDULES : MOCK_SCHEDULES.filter((s) => s.status === filter);
  const totalMonthly = MOCK_SCHEDULES.filter((s) => s.status === "active" && s.frequency === "monthly").reduce((sum, s) => sum + s.amount, 0);
  const nextDue = MOCK_SCHEDULES.filter((s) => s.status === "active").sort((a, b) => a.nextPayment.getTime() - b.nextPayment.getTime())[0];

  return (
    <main className="min-h-screen pt-[72px] pb-20 md:pb-8">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-h1 font-sans text-foreground mb-2">Payment Schedules</h1>
              <p className="text-body font-body text-muted-foreground">
                Programmable recurring payments via smart contract — rents, yields, and disbursements.
              </p>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-5 h-11 rounded-md bg-gradient-primary text-primary-foreground font-body text-body hover:brightness-110 transition-all cursor-pointer shrink-0"
            >
              <Plus size={18} weight="duotone" />
              New Schedule
            </button>
          </div>

          {/* Create Schedule Panel */}
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border-subtle rounded-xl p-6 mb-8"
            >
              <h3 className="text-h3 font-sans text-foreground mb-4">Create Payment Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Payment Type</label>
                  <select className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-body text-foreground focus:outline-none focus:border-cyan">
                    <option>Rent</option>
                    <option>Yield Distribution</option>
                    <option>Mortgage</option>
                    <option>Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Amount (USDC)</label>
                  <input type="number" placeholder="0.00" className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan" />
                </div>
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Frequency</label>
                  <select className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-body text-foreground focus:outline-none focus:border-cyan">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Quarterly</option>
                    <option>Bi-annual</option>
                  </select>
                </div>
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Recipient Address</label>
                  <input type="text" placeholder="0x... or ENS" className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan" />
                </div>
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Start Date</label>
                  <input type="date" className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-body text-foreground focus:outline-none focus:border-cyan" />
                </div>
                <div>
                  <label className="text-caption font-body text-muted-foreground mb-1 block">Network</label>
                  <select className="w-full h-11 px-4 rounded-md bg-muted border border-border-subtle text-body font-body text-foreground focus:outline-none focus:border-cyan">
                    <option>Polygon</option>
                    <option>Ethereum</option>
                    <option>Arbitrum</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button className="flex items-center gap-2 px-6 h-11 rounded-md bg-gradient-primary text-primary-foreground font-body text-body hover:brightness-110 transition-all cursor-pointer">
                  <SealCheck size={16} weight="duotone" />
                  Deploy Schedule
                </button>
                <button onClick={() => setShowCreate(false)} className="px-5 h-11 rounded-md border border-border-subtle text-muted-foreground hover:text-foreground font-body text-body transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Monthly Outflow", value: `$${totalMonthly.toLocaleString()}`, sub: "Active monthly schedules", icon: CurrencyDollar, color: "text-cyan" },
              { label: "Active Schedules", value: MOCK_SCHEDULES.filter((s) => s.status === "active").length, sub: "Running on-chain", icon: Lightning, color: "text-success" },
              { label: "Next Payment Due", value: nextDue ? `${daysUntil(nextDue.nextPayment)}d` : "—", sub: nextDue?.property ?? "None upcoming", icon: CalendarCheck, color: "text-accent" },
              { label: "Total Paid (all time)", value: `$${MOCK_SCHEDULES.reduce((s, p) => s + p.totalPaid, 0).toLocaleString()}`, sub: "Across all schedules", icon: CheckCircle, color: "text-foreground" },
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

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["all", "active", "upcoming", "paused", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 h-9 rounded-md text-body-sm font-body transition-colors cursor-pointer capitalize ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border-subtle text-muted-foreground hover:text-foreground hover:border-cyan"}`}
              >
                {f === "all" ? "All Schedules" : f}
              </button>
            ))}
          </div>

          {/* Schedule Cards */}
          <div className="space-y-4">
            {filtered.map((schedule, i) => {
              const typeConf = TYPE_CONFIG[schedule.type];
              const statusConf = STATUS_CONFIG[schedule.status];
              const StatusIcon = statusConf.icon;
              const progress = (schedule.completedPayments / schedule.totalPayments) * 100;
              const days = daysUntil(schedule.nextPayment);

              return (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card border border-border-subtle rounded-xl p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Type badge */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeConf.bg}`}>
                      <ArrowsClockwise size={20} weight="duotone" className={typeConf.color} />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-body font-sans text-foreground">{schedule.property}</span>
                        <span className={`text-caption font-body px-2 py-0.5 rounded border flex items-center gap-1 ${statusConf.className}`}>
                          <StatusIcon size={11} weight="duotone" />
                          {statusConf.label}
                        </span>
                        <span className={`text-caption font-body px-2 py-0.5 rounded ${typeConf.bg} ${typeConf.color}`}>
                          {typeConf.label}
                        </span>
                      </div>
                      <p className="text-body-sm font-body text-muted-foreground mb-2">{schedule.city} · {FREQ_LABEL[schedule.frequency]} · {schedule.network}</p>

                      {/* Progress bar */}
                      <div className="mb-1">
                        <div className="flex justify-between text-caption font-body text-muted-foreground mb-1">
                          <span>{schedule.completedPayments} / {schedule.totalPayments} payments</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${typeConf.bg.replace("bg-", "bg-").replace("/10", "")} ${typeConf.color.replace("text-", "bg-")}`} style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Amount & next payment */}
                    <div className="flex flex-wrap gap-6 shrink-0">
                      <div>
                        <p className="text-caption font-body text-muted-foreground">Per Payment</p>
                        <p className={`text-body-sm font-mono ${typeConf.color}`}>${schedule.amount.toLocaleString()} {schedule.currency}</p>
                      </div>
                      <div>
                        <p className="text-caption font-body text-muted-foreground">Next Due</p>
                        <p className={`text-body-sm font-mono ${days <= 7 ? "text-warning" : "text-foreground"}`}>
                          {schedule.lastPayment === null ? "Not started" : `In ${days}d`}
                        </p>
                      </div>
                      <div>
                        <p className="text-caption font-body text-muted-foreground">Total Paid</p>
                        <p className="text-body-sm font-mono text-foreground">${schedule.totalPaid.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      {schedule.status === "active" && (
                        <button className="flex items-center gap-1.5 px-3 h-9 rounded-md border border-border-subtle text-muted-foreground hover:text-warning hover:border-warning/50 text-body-sm font-body transition-colors cursor-pointer">
                          <Pause size={13} weight="duotone" />
                          Pause
                        </button>
                      )}
                      {schedule.status === "paused" && (
                        <button className="flex items-center gap-1.5 px-3 h-9 rounded-md border border-cyan/40 text-cyan text-body-sm font-body hover:bg-cyan/10 transition-colors cursor-pointer">
                          <Play size={13} weight="duotone" />
                          Resume
                        </button>
                      )}
                      {schedule.status === "upcoming" && (
                        <button className="flex items-center gap-1.5 px-3 h-9 rounded-md bg-gradient-primary text-primary-foreground text-body-sm font-body hover:brightness-110 transition-all cursor-pointer">
                          <Lightning size={13} weight="duotone" />
                          Activate
                        </button>
                      )}
                      <button className="flex items-center gap-1.5 px-3 h-9 rounded-md bg-muted text-foreground hover:bg-secondary text-body-sm font-body transition-colors cursor-pointer">
                        <Buildings size={13} weight="duotone" />
                        View
                      </button>
                    </div>
                  </div>

                  {/* Upcoming warning */}
                  {schedule.status === "active" && days <= 7 && (
                    <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-warning/10 border border-warning/20 text-body-sm font-body text-warning">
                      <Warning size={14} weight="duotone" />
                      Payment due in {days} day{days !== 1 ? "s" : ""} — ensure sufficient USDC balance.
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Smart Contract Info banner */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 p-5 rounded-xl border border-accent/20 bg-accent/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <SealCheck size={20} weight="duotone" className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-body font-body text-foreground mb-0.5">All schedules are deployed as on-chain smart contracts</p>
              <p className="text-body-sm font-body text-muted-foreground">Payments execute automatically on the specified cadence — trustless, transparent, and unstoppable once activated.</p>
            </div>
            <Link to="/escrow" className="flex items-center gap-2 px-4 h-10 rounded-md border border-accent/40 text-accent text-body-sm font-body hover:bg-accent/10 transition-colors cursor-pointer shrink-0">
              <CheckCircle size={16} weight="duotone" />
              View Escrow
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}
