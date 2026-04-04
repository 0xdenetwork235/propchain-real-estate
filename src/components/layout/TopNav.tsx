import React, { useState } from "react";
import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Buildings,
  ChartPieSlice,
  ArrowsLeftRight,
  GraduationCap,
  Wallet,
  List,
  X,
  CaretDown,
  SignOut,
  Copy,
  UserCircle,
  SignIn,
} from "@phosphor-icons/react";
import { useApp } from "../../context/AppContext";

const navLinks = [
  { label: "Marketplace", path: "/marketplace", icon: Buildings },
  { label: "My Portfolio", path: "/portfolio", icon: ChartPieSlice },
  { label: "Transactions", path: "/transactions", icon: ArrowsLeftRight },
  { label: "Learn", path: "/learn", icon: GraduationCap },
];

export default function TopNav() {
  const location = useLocation();
  const isLanding = useMatch("/");
  const navigate = useNavigate();
  const { wallet, disconnectWallet, setWalletModalOpen, authUser, isAnonymous, logoutUser } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // All hooks above — safe to conditionally return now
  if (isLanding) return null;

  const shortAddress = wallet.address
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : null;

  const copyAddress = () => {
    if (wallet.address) navigator.clipboard.writeText(wallet.address);
  };

  const displayName = authUser?.name || authUser?.email?.split("@")[0] || "Account";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[hsl(220,15%,8%)] border-b border-border-subtle flex items-center">
      <div className="max-w-[1440px] mx-auto w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center">
            <Buildings size={18} weight="duotone" className="text-foreground" />
          </div>
          <span className="font-sans font-medium text-[18px] text-foreground tracking-tight">
            PropChain
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(({ label, path, icon: Icon }) => {
            const isActive =
              location.pathname === path ||
              (path === "/marketplace" && location.pathname === "/");
            return (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-2 px-4 h-[48px] text-body font-body font-normal transition-colors duration-200 rounded-md cursor-pointer
                  ${isActive
                    ? "text-cyan"
                    : "text-neutral-300 hover:text-foreground hover:bg-[hsl(220,20%,20%)]"
                  }`}
              >
                <Icon size={18} weight="duotone" />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-cyan rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Email Auth button */}
          {isAnonymous ? (
            <button
              onClick={() => navigate("/auth")}
              className="hidden md:flex items-center gap-2 px-4 h-[44px] rounded-md border border-border-subtle bg-card text-foreground hover:border-cyan/50 hover:bg-cyan/5 text-body-sm font-body transition-all duration-200 cursor-pointer"
              aria-label="Sign in"
            >
              <SignIn size={17} weight="duotone" className="text-cyan" />
              Sign In
            </button>
          ) : (
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-4 h-[44px] rounded-md bg-secondary text-secondary-foreground hover:bg-secondary-hover transition-colors duration-200 cursor-pointer"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center">
                  <UserCircle size={14} weight="duotone" className="text-foreground" />
                </div>
                <span className="text-body-sm font-body text-foreground max-w-[120px] truncate">
                  {displayName}
                </span>
                <CaretDown size={14} weight="duotone" className="text-neutral-300" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-card border border-border-subtle rounded-lg p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-border-subtle mb-2">
                      <p className="text-caption font-body text-muted-foreground">Signed in as</p>
                      <p className="text-body-sm font-body text-foreground truncate mt-0.5">{authUser?.email}</p>
                    </div>
                    {wallet.connected ? (
                      <div className="px-3 py-2 border-b border-border-subtle mb-2">
                        <p className="text-caption font-body text-muted-foreground">Connected Wallet</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-body-sm font-mono text-foreground">{shortAddress}</p>
                          <button
                            onClick={copyAddress}
                            className="text-muted-foreground hover:text-cyan transition-colors cursor-pointer"
                            aria-label="Copy address"
                          >
                            <Copy size={14} weight="duotone" />
                          </button>
                        </div>
                        <p className="text-caption font-body text-cyan mt-1">
                          {wallet.balance.toLocaleString()} USDC
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setWalletModalOpen(true); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-body-sm font-body text-foreground hover:bg-muted transition-colors cursor-pointer mb-1"
                      >
                        <Wallet size={16} weight="duotone" className="text-cyan" />
                        Connect Wallet
                      </button>
                    )}
                    {wallet.connected && (
                      <button
                        onClick={() => { disconnectWallet(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-body-sm font-body text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Wallet size={16} weight="duotone" />
                        Disconnect Wallet
                      </button>
                    )}
                    <button
                      onClick={() => { logoutUser(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-body-sm font-body text-error hover:bg-muted transition-colors cursor-pointer"
                    >
                      <SignOut size={16} weight="duotone" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Wallet Button (only if logged in and wallet not connected) */}
          {!isAnonymous && !wallet.connected && (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-5 h-[44px] rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body transition-all duration-200 wallet-glow cursor-pointer hover:brightness-110"
              aria-label="Connect Wallet"
            >
              <Wallet size={18} weight="duotone" />
              Connect Wallet
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={22} weight="duotone" />
            ) : (
              <List size={22} weight="duotone" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[72px] left-0 right-0 bg-[hsl(220,15%,8%)] border-b border-border-subtle md:hidden z-50"
          >
            <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
              {navLinks.map(({ label, path, icon: Icon }) => {
                const isActive =
                  location.pathname === path ||
                  (path === "/marketplace" && location.pathname === "/");
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-body font-body transition-colors cursor-pointer
                      ${isActive ? "bg-secondary text-cyan" : "text-neutral-300 hover:bg-muted hover:text-foreground"}`}
                  >
                    <Icon size={20} weight="duotone" />
                    {label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-border-subtle mt-2 space-y-2">
                {isAnonymous ? (
                  <button
                    onClick={() => { navigate("/auth"); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md border border-border-subtle text-foreground font-body font-normal text-body cursor-pointer hover:border-cyan"
                  >
                    <SignIn size={18} weight="duotone" className="text-cyan" />
                    Sign In / Sign Up
                  </button>
                ) : (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-body-sm font-body text-muted-foreground truncate">
                        {authUser?.email}
                      </p>
                    </div>
                    {!wallet.connected && (
                      <button
                        onClick={() => { setWalletModalOpen(true); setMobileOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body cursor-pointer"
                      >
                        <Wallet size={18} weight="duotone" />
                        Connect Wallet
                      </button>
                    )}
                    {wallet.connected && (
                      <button
                        onClick={() => { disconnectWallet(); setMobileOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-body-sm font-body text-muted-foreground cursor-pointer"
                      >
                        <Wallet size={16} weight="duotone" />
                        Disconnect Wallet ({shortAddress})
                      </button>
                    )}
                    <button
                      onClick={() => { logoutUser(); setMobileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-body-sm font-body text-error cursor-pointer"
                    >
                      <SignOut size={16} weight="duotone" />
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
