import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";

const walletOptions = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Connect using browser extension",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Scan with mobile wallet",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Connect with Coinbase",
  },
];

export default function WalletModal() {
  const { walletModalOpen, setWalletModalOpen, connectWallet } = useApp();

  return (
    <AnimatePresence>
      {walletModalOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setWalletModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Connect Wallet"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-card border border-border-subtle rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-h3 font-sans text-foreground">
                  Connect Wallet
                </h2>
                <p className="text-body-sm font-body text-muted-foreground mt-1">
                  Choose your preferred wallet provider
                </p>
              </div>
              <button
                onClick={() => setWalletModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} weight="duotone" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {walletOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => connectWallet(option.name)}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border-subtle bg-muted hover:border-cyan hover:bg-[hsl(195,100%,20%)] transition-all duration-200 cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-md bg-gradient-primary flex items-center justify-center shrink-0">
                    <Wallet
                      size={20}
                      weight="duotone"
                      className="text-foreground"
                    />
                  </div>
                  <div>
                    <p className="text-body font-body font-medium text-foreground group-hover:text-cyan transition-colors">
                      {option.name}
                    </p>
                    <p className="text-body-sm font-body text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-caption font-body text-muted-foreground text-center mt-6">
              By connecting, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
