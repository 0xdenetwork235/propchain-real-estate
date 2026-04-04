import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlass,
  Funnel,
  SquaresFour,
  Rows,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { useQuery } from "@animaapp/playground-react-sdk";
// Auth is handled via AppContext — no SDK auth import needed
import { mockProperties } from "../data/mockData";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import { useApp } from "../context/AppContext";
import { Property } from "../types";

type ViewMode = "grid" | "list";
type StatusFilter = "all" | "active" | "funded" | "coming_soon";
type SortOption = "roi_desc" | "roi_asc" | "price_asc" | "price_desc";

export default function Marketplace() {
  const { setCommandPaletteOpen } = useApp();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("roi_desc");

  const { data: sdkProperties, isPending } = useQuery("Property");

  // Use SDK data if available, otherwise fall back to static mock data
  const allProperties: Property[] = useMemo(() => {
    if (sdkProperties && sdkProperties.length > 0) return sdkProperties as unknown as Property[];
    return mockProperties;
  }, [sdkProperties]);

  const cities = useMemo(
    () => ["all", ...Array.from(new Set(allProperties.map((p) => p.city)))],
    [allProperties],
  );

  const filtered = useMemo(() => {
    let result = [...allProperties];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all")
      result = result.filter((p) => p.status === statusFilter);
    if (cityFilter !== "all")
      result = result.filter((p) => p.city === cityFilter);
    result.sort((a, b) => {
      if (sortBy === "roi_desc") return b.roiAnnual - a.roiAnnual;
      if (sortBy === "roi_asc") return a.roiAnnual - b.roiAnnual;
      if (sortBy === "price_asc") return a.tokenPrice - b.tokenPrice;
      if (sortBy === "price_desc") return b.tokenPrice - a.tokenPrice;
      return 0;
    });
    return result;
  }, [allProperties, search, statusFilter, cityFilter, sortBy]);

  return (
    <main className="min-h-screen pt-[72px] pb-20 md:pb-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-secondary border-b border-border-subtle">
        <div className="max-w-[1440px] mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-h1 font-sans text-foreground mb-3">
              Invest in <span className="text-gradient-accent">Tokenized</span>{" "}
              Real Estate
            </h1>
            <p className="text-body-lg font-body text-neutral-300 max-w-xl mb-6">
              Fractional ownership of premium properties worldwide, powered by
              blockchain transparency.
            </p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-h3 font-sans text-cyan">$24.5M+</p>
                <p className="text-body-sm font-body text-muted-foreground">
                  Total Value Locked
                </p>
              </div>
              <div>
                <p className="text-h3 font-sans text-success">12.4%</p>
                <p className="text-body-sm font-body text-muted-foreground">
                  Avg. Annual ROI
                </p>
              </div>
              <div>
                <p className="text-h3 font-sans text-accent">{allProperties.length}</p>
                <p className="text-body-sm font-body text-muted-foreground">
                  Active Properties
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass
              size={18}
              weight="duotone"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties, cities..."
              className="w-full h-11 pl-10 pr-4 bg-card border border-border-subtle rounded-md text-body font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/30 transition-colors"
              aria-label="Search properties"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* City Filter */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-11 px-3 bg-card border border-border-subtle rounded-md text-body-sm font-body text-foreground focus:outline-none focus:border-cyan cursor-pointer"
              aria-label="Filter by city"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-card text-foreground">
                  {c === "all" ? "All Cities" : c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex gap-1 bg-card border border-border-subtle rounded-md p-1">
              {(["all", "active", "funded", "coming_soon"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded text-body-sm font-body transition-colors cursor-pointer
                    ${statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {s === "all" ? "All" : s === "coming_soon" ? "Soon" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-11 px-3 bg-card border border-border-subtle rounded-md text-body-sm font-body text-foreground focus:outline-none focus:border-cyan cursor-pointer"
              aria-label="Sort properties"
            >
              <option value="roi_desc" className="bg-card">Highest ROI</option>
              <option value="roi_asc" className="bg-card">Lowest ROI</option>
              <option value="price_asc" className="bg-card">Lowest Price</option>
              <option value="price_desc" className="bg-card">Highest Price</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-1 bg-card border border-border-subtle rounded-md p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors cursor-pointer ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <SquaresFour size={18} weight="duotone" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors cursor-pointer ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <Rows size={18} weight="duotone" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-body-sm font-body text-muted-foreground">
            {filtered.length}{" "}
            {filtered.length === 1 ? "property" : "properties"} found
          </p>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 text-body-sm font-body text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Open command palette"
          >
            <SlidersHorizontal size={16} weight="duotone" />
            <span>Quick search</span>
            <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Property Grid/List */}
        {isPending ? (
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Funnel size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-h3 font-sans text-foreground mb-2">No properties found</h3>
            <p className="text-body font-body text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-3xl"}`}
          >
            {filtered.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
