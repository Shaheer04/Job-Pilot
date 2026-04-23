"use client";

import React from "react";

export const OverviewSkeleton = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-outline-variant/10 pb-8">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-zinc-800 rounded-lg"></div>
          <div className="h-4 w-96 bg-zinc-900 rounded-md"></div>
        </div>
        <div className="h-10 w-40 bg-zinc-800 rounded-lg"></div>
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-container-low p-6 border border-outline-variant/5 rounded-2xl space-y-4">
            <div className="h-2 w-24 bg-zinc-800 rounded"></div>
            <div className="h-10 w-16 bg-zinc-800 rounded-lg"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content Skeleton */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-surface-container-low p-8 border border-outline-variant/5 rounded-2xl h-[400px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-5 w-5 bg-zinc-800 rounded"></div>
              <div className="h-5 w-40 bg-zinc-800 rounded"></div>
            </div>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-2 w-20 bg-zinc-800 rounded"></div>
                    <div className="h-2 w-16 bg-zinc-800 rounded"></div>
                  </div>
                  <div className="h-3 w-full bg-zinc-900 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-zinc-900/40 border border-outline-variant/10 p-8 rounded-2xl h-[300px] space-y-6">
            <div className="h-4 w-32 bg-zinc-800 rounded"></div>
            <div className="h-16 w-full bg-zinc-800/50 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-10 w-full bg-zinc-800/30 rounded-lg"></div>
              <div className="h-10 w-full bg-zinc-800/30 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
