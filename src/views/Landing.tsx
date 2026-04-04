import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Buildings,
  Wallet,
  ShieldCheck,
  ChartLineUp,
  ArrowRight,
  Globe,
  CurrencyDollar,
  Lock,
  Users,
  Star,
  ArrowUpRight,
  CheckCircle,
  Lightning,
  Diamond,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { mockProperties } from "../data/mockData";

/* ─────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────── */
function CountUp({ target, prefix = "", suffix = "", duration = 2000 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{prefix}{value.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   Section wrapper with fade-in
───────────────────────────────────────────── */
function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Stats
───────────────────────────────────────────── */
const stats = [
  { label: "Total Value Locked", value: 284, prefix: "$", suffix: "M+" },
  { label: "Properties Tokenized", value: 1200, suffix: "+" },
  { label: "Active Investors", value: 48000, suffix: "+" },
  { label: "Avg. Annual ROI", value: 14, suffix: "%" },
];

/* ─────────────────────────────────────────────
   Features
───────────────────────────────────────────── */
const features = [
  {
    icon: Lightning,
    title: "Instant Tokenization",
    description: "Real-world properties are converted to on-chain tokens in minutes. Buy, sell, or transfer ownership 24/7 without brokers.",
    color: "text-cyan",
    bg: "bg-cyan/10",
  },
  {
    icon: CurrencyDollar,
    title: "Passive Rental Income",
    description: "Earn your share of rental revenue directly to your wallet every month — fully automated via smart contracts.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Lock,
    title: "Audited Smart Contracts",
    description: "Every property token is backed by legally structured SPVs and audited contracts deployed on Ethereum, Polygon, and Arbitrum.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Globe,
    title: "Global Portfolio",
    description: "Diversify across premium properties in Singapore, Dubai, Monaco, New York, London, and more — starting from just $175.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ChartLineUp,
    title: "Real-Time Analytics",
    description: "Track price appreciation, yield distributions, and portfolio performance with live on-chain data dashboards.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Users,
    title: "Community Governance",
    description: "Token holders vote on property decisions — renovations, lease renewals, exits — putting power back in your hands.",
    color: "text-tertiary",
    bg: "bg-tertiary/10",
  },
];

/* ─────────────────────────────────────────────
   How It Works steps
───────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    title: "Connect Your Wallet",
    description: "Link MetaMask, WalletConnect, or Coinbase Wallet in one click to access the platform.",
    icon: Wallet,
  },
  {
    number: "02",
    title: "Browse Properties",
    description: "Explore curated, vetted real-estate opportunities across global markets with full transparency.",
    icon: Buildings,
  },
  {
    number: "03",
    title: "Invest & Earn",
    description: "Purchase property tokens and start receiving monthly rental yields and capital appreciation.",
    icon: ChartLineUp,
  },
  {
    number: "04",
    title: "Trade Anytime",
    description: "Exit or rebalance your holdings on the secondary market — no lock-ups, no paperwork.",
    icon: ArrowUpRight,
  },
];

/* ─────────────────────────────────────────────
   Testimonials
───────────────────────────────────────────── */
const testimonials = [
  {
    name: "Aisha Al-Mansoori",
    role: "DeFi Investor, Dubai",
    avatar: "AM",
    avatarColor: "from-cyan/80 to-primary",
    text: "PropChain gave me access to Monaco real estate I never could have afforded alone. My portfolio is up 22% in 8 months.",
    rating: 5,
  },
  {
    name: "Luca Ferrari",
    role: "Angel Investor, Milan",
    avatar: "LF",
    avatarColor: "from-accent/80 to-primary",
    text: "Finally, real estate investing without the middlemen. The yields hit my wallet every month like clockwork.",
    rating: 5,
  },
  {
    name: "Hiroshi Nakamura",
    role: "Portfolio Manager, Tokyo",
    avatar: "HN",
    avatarColor: "from-success/80 to-tertiary",
    text: "The analytics dashboard is insane. I can track every token, every yield, every price move in real time.",
    rating: 5,
  },
];

/* ─────────────────────────────────────────────
   Main Landing Component
───────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const { setWalletModalOpen, isAnonymous } = useApp();
  const featuredProperties = mockProperties.filter((p) => p.status === "active").slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-[72px]">
        {/* Background grid + gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(220,10%,40%) 1px, transparent 1px), linear-gradient(90deg, hsl(220,10%,40%) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
            style={{ background: "radial-gradient(circle, hsl(220,85%,45%) 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
            style={{ background: "radial-gradient(circle, hsl(295,80%,55%) 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[150px] opacity-10"
            style={{ background: "radial-gradient(circle, hsl(195,100%,65%) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5 text-cyan text-caption font-body mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            Web3 Real Estate Platform — Now Live on Mainnet
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-sans font-medium text-[56px] md:text-[80px] leading-[1.1] tracking-tight mb-6"
          >
            Own{" "}
            <span className="text-gradient-accent">Premium Real Estate</span>
            <br />
            Starting at <span className="text-cyan">$175</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="text-body-lg font-body text-neutral-300 max-w-[640px] mx-auto mb-10 leading-relaxed"
          >
            PropChain tokenizes high-yield properties across global markets. Earn monthly rental income, trade anytime, and build a borderless real-estate portfolio — fully on-chain.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/marketplace"
              className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-primary text-foreground font-body font-medium text-body-lg transition-all duration-200 hover:brightness-110 wallet-glow"
            >
              <Buildings size={20} weight="duotone" />
              Explore Properties
              <ArrowRight size={18} weight="bold" />
            </Link>
            {isAnonymous ? (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center gap-2 px-8 py-4 rounded-lg border border-border bg-glass text-foreground font-body font-normal text-body-lg hover:border-cyan/50 hover:bg-cyan/5 transition-all duration-200 cursor-pointer"
              >
                <Wallet size={20} weight="duotone" />
                Sign In / Sign Up
              </button>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-lg border border-border bg-glass text-foreground font-body font-normal text-body-lg hover:border-cyan/50 hover:bg-cyan/5 transition-all duration-200 cursor-pointer"
              >
                <Wallet size={20} weight="duotone" />
                Connect Wallet
              </button>
            )}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-caption font-body text-muted-foreground"
          >
            {["Ethereum Mainnet", "Polygon", "Arbitrum", "Audited by Certik", "SEC-Compliant SPVs"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={13} weight="duotone" className="text-success" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-caption font-body">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-border flex items-center justify-center"
          >
            <div className="w-1 h-2 rounded-full bg-cyan" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS TICKER ─────────────────────────── */}
      <section className="border-y border-border-subtle bg-card/50 py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeSection key={s.label} delay={i * 0.08} className="text-center">
                <p className="font-sans font-medium text-[40px] leading-none text-foreground mb-1">
                  <CountUp target={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="text-body-sm font-body text-muted-foreground">{s.label}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ──────────────────── */}
      <section className="py-24 max-w-[1200px] mx-auto px-6">
        <FadeSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-caption font-body text-cyan uppercase tracking-widest mb-2">Live Listings</p>
            <h2 className="font-sans font-medium text-h2 text-foreground">Featured Properties</h2>
          </div>
          <Link
            to="/marketplace"
            className="flex items-center gap-2 text-body-sm font-body text-cyan hover:text-foreground transition-colors"
          >
            View all listings <ArrowRight size={15} />
          </Link>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProperties.map((property, i) => (
            <FadeSection key={property.id} delay={i * 0.1}>
              <Link to={`/property/${property.id}`} className="group block glass-card rounded-lg overflow-hidden hover:border-cyan/40 transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded text-caption font-body bg-success/20 text-success border border-success/30">
                      Live
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-caption font-body text-muted-foreground">{property.network}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-sans font-medium text-h4 text-foreground mb-1 truncate">{property.name}</h3>
                  <p className="text-body-sm font-body text-muted-foreground mb-4">{property.city}, {property.country}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-caption font-body text-muted-foreground">Annual ROI</p>
                      <p className="font-sans font-medium text-h4 text-success">{property.roiAnnual}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-caption font-body text-muted-foreground">Min. Investment</p>
                      <p className="font-sans font-medium text-h4 text-cyan">${property.minInvestment}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-caption font-body text-muted-foreground mb-1">
                      <span>Funding progress</span>
                      <span>{Math.round(((property.totalTokens - property.availableTokens) / property.totalTokens) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary rounded-full"
                        style={{ width: `${((property.totalTokens - property.availableTokens) / property.totalTokens) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="py-24 border-y border-border-subtle bg-card/30">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeSection className="text-center mb-16">
            <p className="text-caption font-body text-cyan uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="font-sans font-medium text-h2 text-foreground mb-4">How PropChain Works</h2>
            <p className="text-body font-body text-muted-foreground max-w-[520px] mx-auto">
              From wallet connection to passive income — getting started takes less than 5 minutes.
            </p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {steps.map((step, i) => (
              <FadeSection key={step.number} delay={i * 0.12} className="relative text-center">
                <div className="flex justify-center mb-5">
                  <div className="relative w-20 h-20 rounded-full bg-card border border-border-subtle flex items-center justify-center">
                    <step.icon size={28} weight="duotone" className="text-cyan" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-primary text-foreground text-caption font-mono flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                </div>
                <h3 className="font-sans font-medium text-h4 text-foreground mb-2">{step.title}</h3>
                <p className="text-body-sm font-body text-muted-foreground leading-relaxed">{step.description}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section className="py-24 max-w-[1200px] mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <p className="text-caption font-body text-cyan uppercase tracking-widest mb-2">Why PropChain</p>
          <h2 className="font-sans font-medium text-h2 text-foreground mb-4">Built for the New Era of Investing</h2>
          <p className="text-body font-body text-muted-foreground max-w-[560px] mx-auto">
            Everything traditional real estate can&#39;t give you — liquidity, access, transparency, and automation — all in one platform.
          </p>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeSection key={f.title} delay={i * 0.08}>
              <div className="glass-card rounded-lg p-6 hover:border-border transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-lg ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon size={24} weight="duotone" className={f.color} />
                </div>
                <h3 className="font-sans font-medium text-h4 text-foreground mb-2">{f.title}</h3>
                <p className="text-body-sm font-body text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="py-24 border-y border-border-subtle bg-card/30">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeSection className="text-center mb-16">
            <p className="text-caption font-body text-cyan uppercase tracking-widest mb-2">Investors Say</p>
            <h2 className="font-sans font-medium text-h2 text-foreground">Trusted Globally</h2>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeSection key={t.name} delay={i * 0.1}>
                <div className="glass-card rounded-lg p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={14} weight="fill" className="text-warning" />
                    ))}
                  </div>
                  <p className="text-body font-body text-neutral-200 leading-relaxed flex-1">&#34;{t.text}&#34;</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-foreground text-body-sm font-sans font-medium`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-body-sm font-body font-medium text-foreground">{t.name}</p>
                      <p className="text-caption font-body text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY SECTION ─────────────────────── */}
      <section className="py-24 max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeSection>
            <p className="text-caption font-body text-cyan uppercase tracking-widest mb-3">Security First</p>
            <h2 className="font-sans font-medium text-h2 text-foreground mb-5">
              Your Assets Are <span className="text-gradient-accent">Protected</span>
            </h2>
            <p className="text-body font-body text-muted-foreground mb-8 leading-relaxed">
              Every property is held in a legally structured Special Purpose Vehicle (SPV). Your token represents real legal ownership, protected by both smart contract code and traditional law.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: ShieldCheck, text: "Smart contracts audited by Certik & OpenZeppelin", color: "text-success" },
                { icon: Lock, text: "Funds secured in multi-sig escrow wallets", color: "text-cyan" },
                { icon: Diamond, text: "Regulatory compliance in 40+ jurisdictions", color: "text-accent" },
                { icon: CheckCircle, text: "ISO 27001 certified infrastructure", color: "text-warning" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-card flex items-center justify-center shrink-0">
                    <item.icon size={16} weight="duotone" className={item.color} />
                  </div>
                  <p className="text-body-sm font-body text-neutral-200">{item.text}</p>
                </div>
              ))}
            </div>
          </FadeSection>

          <FadeSection delay={0.15}>
            <div className="relative">
              <div className="glass-card rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-body-sm font-body text-muted-foreground">Live Network Status</span>
                  <span className="flex items-center gap-1.5 text-caption font-body text-success">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    All Systems Operational
                  </span>
                </div>
                {[
                  { chain: "Ethereum Mainnet", status: "99.98%", color: "text-primary" },
                  { chain: "Polygon PoS", status: "99.99%", color: "text-accent" },
                  { chain: "Arbitrum One", status: "99.97%", color: "text-cyan" },
                ].map((net) => (
                  <div key={net.chain} className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-success`} />
                      <span className="text-body-sm font-body text-foreground">{net.chain}</span>
                    </div>
                    <span className={`text-body-sm font-mono ${net.color}`}>{net.status} uptime</span>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-caption font-body text-muted-foreground">Total transactions processed</span>
                  <span className="font-mono text-body-sm text-cyan">2,847,391</span>
                </div>
              </div>
              {/* decorative glow */}
              <div className="absolute -inset-px rounded-xl bg-gradient-primary opacity-10 blur-xl -z-10" />
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────── */}
      <section className="py-24 px-6">
        <FadeSection>
          <div className="max-w-[1200px] mx-auto relative overflow-hidden rounded-2xl border border-border-subtle bg-card">
            {/* Orb glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-20"
              style={{ background: "radial-gradient(circle, hsl(220,85%,45%) 0%, hsl(295,80%,55%) 100%)" }} />
            <div className="relative z-10 text-center py-20 px-6">
              <p className="text-caption font-body text-cyan uppercase tracking-widest mb-3">Start Today</p>
              <h2 className="font-sans font-medium text-[44px] md:text-[56px] leading-[1.1] tracking-tight text-foreground mb-5">
                Your First Property Token<br />is One Click Away
              </h2>
              <p className="text-body-lg font-body text-muted-foreground max-w-[480px] mx-auto mb-10">
                Join 48,000+ investors already building global real-estate portfolios on PropChain.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/marketplace"
                  className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-primary text-foreground font-body font-medium text-body-lg hover:brightness-110 transition-all duration-200 wallet-glow"
                >
                  <Buildings size={20} weight="duotone" />
                  Start Investing
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <Link
                  to="/learn"
                  className="flex items-center gap-2 px-8 py-4 rounded-lg border border-border text-foreground font-body font-normal text-body-lg hover:border-cyan/50 hover:text-cyan transition-all duration-200"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="border-t border-border-subtle py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center">
                <Buildings size={18} weight="duotone" className="text-foreground" />
              </div>
              <span className="font-sans font-medium text-[18px] text-foreground tracking-tight">PropChain</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-body-sm font-body text-muted-foreground">
              <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
              <Link to="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
              <Link to="/transactions" className="hover:text-foreground transition-colors">Transactions</Link>
              <Link to="/learn" className="hover:text-foreground transition-colors">Learn</Link>
            </div>
            <p className="text-caption font-body text-muted-foreground">
              © 2026 PropChain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
