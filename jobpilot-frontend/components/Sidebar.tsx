"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUIStore } from "@/store/uiStore";

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { openAddJobModal } = useUIStore();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    router.push("/login");
  };

  const navItems = [
    { name: "Overview", href: "/overview", icon: "dashboard" },
    { name: "Kanban", href: "/", icon: "view_kanban" },
    { name: "Analytics", href: "#", icon: "analytics" },
    { name: "Settings", href: "#", icon: "settings" },
  ];

  return (
    <aside className="w-64 h-screen border-r border-zinc-800/50 bg-zinc-900 flex flex-col py-6 px-4 shrink-0">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold tracking-tighter text-white">JobPilot</h1>
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
          Tactical Archive
        </p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-white font-medium bg-zinc-800/50 border-r-2 border-indigo-500"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "text-indigo-500" : ""}`} data-icon={item.icon}>
                {item.icon}
              </span>
              <span className="font-semibold text-lg tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <button 
        onClick={openAddJobModal}
        className="mt-4 mb-8 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-md text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
      >
        Add Job
      </button>
      <div className="pt-6 border-t border-zinc-800/50 space-y-1">
        <a
          className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 transition-colors duration-200 rounded-lg"
          href="#"
        >
          <span className="material-symbols-outlined text-indigo-500" data-icon="help">
            help
          </span>
          <span className="font-semibold text-lg tracking-tight">Support</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 transition-colors duration-200 rounded-lg"
        >
          <span className="material-symbols-outlined text-indigo-500" data-icon="logout">
            logout
          </span>
          <span className="font-semibold text-lg tracking-tight">Logout</span>
        </button>
      </div>
    </aside>
  );
};
