import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass,
  Buildings,
  ChartPieSlice,
  ArrowsLeftRight,
  GraduationCap,
  ArrowRight,
} from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";
import { mockProperties } from "../data/mockData";

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useApp();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);

  const navItems = [
    { label: "Marketplace", path: "/marketplace", icon: Buildings },
    { label: "My Portfolio", path: "/portfolio", icon: ChartPieSlice },
    { label: "Transactions", path: "/transactions", icon: ArrowsLeftRight },
    { label: "Learn", path: "/learn", icon: GraduationCap },
  ];

  const filteredProperties = query
    ? mockProperties.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.city.toLowerCase().includes(query.toLowerCase()),
      )
    : mockProperties.slice(0, 3);

  const filteredNav = query
    ? navItems.filter((n) =>
        n.label.toLowerCase().includes(query.toLowerCase()),
      )
    : navItems;

  const handleNavigate = (path: string) => {
    navigate(path);
    setCommandPaletteOpen(false);
    setQuery("");
  };

  if (!commandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        onClick={() => setCommandPaletteOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl bg-card border border-border-subtle rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Command palette"
          aria-modal="true"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
            <MagnifyingGlass
              size={20}
              weight="duotone"
              className="text-muted-foreground shrink-0"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties, pages, actions..."
              className="flex-1 bg-transparent text-body font-body text-foreground placeholder:text-muted-foreground outline-none"
              aria-label="Search"
            />
            <kbd className="text-caption font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
              ESC
            </kbd>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredNav.length > 0 && (
              <div className="p-2">
                <p className="text-caption font-body text-muted-foreground px-3 py-1 uppercase tracking-wider">
                  Navigation
                </p>
                {filteredNav.map(({ label, path, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => handleNavigate(path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted transition-colors cursor-pointer text-left"
                  >
                    <Icon
                      size={18}
                      weight="duotone"
                      className="text-cyan shrink-0"
                    />
                    <span className="text-body-sm font-body text-foreground">
                      {label}
                    </span>
                    <ArrowRight
                      size={14}
                      weight="duotone"
                      className="text-muted-foreground ml-auto"
                    />
                  </button>
                ))}
              </div>
            )}

            {filteredProperties.length > 0 && (
              <div className="p-2 border-t border-border-subtle">
                <p className="text-caption font-body text-muted-foreground px-3 py-1 uppercase tracking-wider">
                  Properties
                </p>
                {filteredProperties.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => handleNavigate(`/property/${prop.id}`)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted transition-colors cursor-pointer text-left"
                  >
                    <Buildings
                      size={18}
                      weight="duotone"
                      className="text-accent shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-body text-foreground truncate">
                        {prop.name}
                      </p>
                      <p className="text-caption font-body text-muted-foreground">
                        {prop.city} · {prop.roiAnnual}% ROI
                      </p>
                    </div>
                    <span className="text-caption font-mono text-cyan">
                      ${prop.tokenPrice}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {filteredProperties.length === 0 && filteredNav.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-body-sm font-body text-muted-foreground">
                  No results for "{query}"
                </p>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-border-subtle flex items-center gap-4">
            <span className="text-caption font-body text-muted-foreground">
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                ↑↓
              </kbd>{" "}
              navigate
            </span>
            <span className="text-caption font-body text-muted-foreground">
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                ↵
              </kbd>{" "}
              select
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
