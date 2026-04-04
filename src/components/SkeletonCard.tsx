import React from "react";

export default function SkeletonCard() {
  return (
    <div
      className="bg-card border border-border-subtle rounded-lg overflow-hidden"
      aria-hidden="true"
    >
      <div className="h-48 skeleton-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 skeleton-shimmer rounded" />
        <div className="h-4 w-1/2 skeleton-shimmer rounded" />
        <div className="flex gap-3 mt-4">
          <div className="h-8 flex-1 skeleton-shimmer rounded" />
          <div className="h-8 flex-1 skeleton-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
