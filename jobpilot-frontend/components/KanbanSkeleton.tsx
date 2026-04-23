"use client";

import React from "react";

export const KanbanSkeleton = () => {
  const columns = ["Applied", "Assessment", "Followed Up", "Interview", "Offer", "Rejected", "Archived"];
  
  return (
    <div className="flex-1 overflow-x-auto p-8 h-full bg-surface">
      <div className="flex gap-8 h-full min-w-max">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col w-80 shrink-0 opacity-40">
            {/* Column Header Skeleton */}
            <div className="flex items-center gap-3 mb-5 px-3">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
              <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-4 w-6 bg-zinc-800 rounded-md animate-pulse"></div>
            </div>

            {/* Column Cards Skeleton */}
            <div className="rounded-2xl p-3 border border-outline-variant/5 bg-zinc-900/20 min-h-[400px] flex flex-col gap-4">
              {[1, 2].map((card) => (
                <div key={card} className="bg-surface-container-low border border-outline-variant/10 p-5 rounded-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-zinc-800 animate-pulse"></div>
                      <div className="h-2.5 w-16 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    <div className="h-3 w-12 bg-zinc-800 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse"></div>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/10 flex justify-between">
                    <div className="h-2 w-20 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
