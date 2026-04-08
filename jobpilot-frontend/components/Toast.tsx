"use client";

import React from "react";
import { useUIStore } from "@/store/uiStore";

export const Toast = () => {
  const { toast } = useUIStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-zinc-900 border border-outline-variant/20 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      <span className="font-mono text-[10px] text-tertiary">{toast.message}</span>
      <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <div className="w-2/3 h-full bg-tertiary animate-pulse"></div>
      </div>
    </div>
  );
};
