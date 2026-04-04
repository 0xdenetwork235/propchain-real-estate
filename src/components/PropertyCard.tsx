import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  TrendUp,
  Coins,
  ArrowRight,
  Lightning,
} from "@phosphor-icons/react";
import { Property } from "../types";
import { Badge } from "@/components/ui/badge";

interface Props {
  property: Property;
  index?: number;
}

const statusConfig = {
  active: { label: "Active", className: "bg-success text-success-foreground" },
  funded: { label: "Funded", className: "bg-muted text-muted-foreground" },
  coming_soon: {
    label: "Coming Soon",
    className: "bg-warning text-warning-foreground",
  },
};

export default function PropertyCard({ property, index = 0 }: Props) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const fundedPercent = Math.round(
    ((property.totalTokens - property.availableTokens) / property.totalTokens) *
      100,
  );
  const status = statusConfig[property.status];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="bg-card border border-border-subtle rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      onClick={() => navigate(`/property/${property.id}`)}
      role="article"
      aria-label={`${property.name} - ${property.roiAnnual}% annual ROI`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.imageAlt}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,15%,10%)] via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span
            className={`text-caption font-body font-medium px-2.5 py-1 rounded-full ${status.className}`}
          >
            {status.label}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-caption font-mono text-foreground bg-[rgba(0,0,0,0.6)] px-2.5 py-1 rounded-full">
            {property.network}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-h4 font-sans text-foreground mb-1 truncate">
          {property.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin
            size={14}
            weight="duotone"
            className="text-muted-foreground shrink-0"
          />
          <span className="text-body-sm font-body text-muted-foreground truncate">
            {property.location}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-muted rounded-md p-2.5">
            <div className="flex items-center gap-1 mb-1">
              <TrendUp size={12} weight="duotone" className="text-success" />
              <span className="text-caption font-body text-muted-foreground">
                ROI
              </span>
            </div>
            <p className="text-body-sm font-mono font-medium text-success">
              {property.roiAnnual}%
            </p>
          </div>
          <div className="bg-muted rounded-md p-2.5">
            <div className="flex items-center gap-1 mb-1">
              <Coins size={12} weight="duotone" className="text-cyan" />
              <span className="text-caption font-body text-muted-foreground">
                Token
              </span>
            </div>
            <p className="text-body-sm font-mono font-medium text-cyan">
              ${property.tokenPrice}
            </p>
          </div>
          <div className="bg-muted rounded-md p-2.5">
            <div className="flex items-center gap-1 mb-1">
              <Lightning size={12} weight="duotone" className="text-accent" />
              <span className="text-caption font-body text-muted-foreground">
                Yield
              </span>
            </div>
            <p className="text-body-sm font-mono font-medium text-accent">
              {property.rentYield}%
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-caption font-body text-muted-foreground">
              Funded
            </span>
            <span className="text-caption font-mono text-foreground">
              {fundedPercent}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${fundedPercent}%` }}
              role="progressbar"
              aria-valuenow={fundedPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="flex gap-2 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/property/${property.id}`);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-md border border-cyan text-cyan bg-transparent hover:bg-cyan-dim text-body-sm font-body transition-colors cursor-pointer"
              aria-label={`View details for ${property.name}`}
            >
              View Details
              <ArrowRight size={14} weight="duotone" />
            </button>
            {property.status === "active" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/property/${property.id}`);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-md bg-gradient-primary text-primary-foreground text-body-sm font-body transition-all cursor-pointer hover:brightness-110"
                aria-label={`Invest in ${property.name}`}
              >
                Invest
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
