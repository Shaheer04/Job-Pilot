"use client";

import React from "react";

export const FollowUpSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Verdict Section Skeleton */}
      <div className="p-6 rounded-2xl border border-outline-variant/10 bg-surface-container-low/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>
            <div className="h-3 w-full bg-zinc-900 rounded"></div>
            <div className="h-3 w-2/3 bg-zinc-900 rounded"></div>
          </div>
        </div>
      </div>

      {/* Email Section Header Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-800 rounded"></div>
          <div className="h-2 w-32 bg-zinc-800 rounded"></div>
        </div>

        {/* Recipient info skeleton */}
        <div className="h-14 w-full bg-surface-container-low border border-outline-variant/10 rounded-xl"></div>

        {/* Body info skeleton */}
        <div className="bg-zinc-950/50 border border-outline-variant/10 rounded-2xl p-8 space-y-4">
          <div className="h-3 w-full bg-zinc-900 rounded"></div>
          <div className="h-3 w-full bg-zinc-900 rounded"></div>
          <div className="h-3 w-4/5 bg-zinc-900 rounded"></div>
          <div className="h-3 w-full bg-zinc-900 rounded"></div>
          <div className="h-3 w-3/4 bg-zinc-900 rounded"></div>
        </div>
      </div>
    </div>
  );
};
