import React from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import {
  Buildings,
  ChartPieSlice,
  ArrowsLeftRight,
  GraduationCap,
} from "@phosphor-icons/react";

const tabs = [
  { label: "Market", path: "/marketplace", icon: Buildings },
  { label: "Portfolio", path: "/portfolio", icon: ChartPieSlice },
  { label: "Activity", path: "/transactions", icon: ArrowsLeftRight },
  { label: "Learn", path: "/learn", icon: GraduationCap },
];

export default function BottomTabBar() {
  const location = useLocation();
  const isLanding = useMatch("/");

  // All hooks above — safe to do conditional return now
  if (isLanding) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[hsl(220,15%,8%)] border-t border-border-subtle h-16 flex items-center"
      aria-label="Bottom navigation"
    >
      {tabs.map(({ label, path, icon: Icon }) => {
        const isActive =
          location.pathname === path ||
          (path === "/marketplace" && location.pathname === "/");
        return (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors cursor-pointer
              ${isActive ? "text-cyan" : "text-neutral-400 hover:text-neutral-200"}`}
            aria-label={label}
          >
            <Icon size={22} weight="duotone" />
            <span className="text-caption font-body">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
