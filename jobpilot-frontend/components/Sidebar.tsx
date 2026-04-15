"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Kanban, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Download,
  Zap
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { openAddJobModal, isSidebarCollapsed, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    router.push("/login");
  };

  const navItems = [
    { name: "Analytics", href: "/overview", icon: LayoutDashboard },
    { name: "Kanban", href: "/jobs", icon: Kanban },
    { name: "Settings", href: "#", icon: Settings },
  ];

  return (
    <aside className={`${isSidebarCollapsed ? "w-20" : "w-64"} h-screen border-r border-zinc-800/50 bg-zinc-900 flex flex-col py-6 transition-all duration-300 ease-in-out shrink-0 relative`}>
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white z-50 transition-colors shadow-lg"
      >
        {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`mb-8 px-6 transition-opacity duration-300 ${isSidebarCollapsed ? "opacity-0 invisible h-0 mb-0" : "opacity-100"}`}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">JobPilot</h1>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-black ml-1">
          Smart Job Tracker
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isSidebarCollapsed ? item.name : ""}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-white font-medium bg-zinc-800/50 border-r-2 border-indigo-500"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
            >
              <Icon size={20} className={isActive ? "text-indigo-500" : ""} />
              {!isSidebarCollapsed && (
                <span className="font-semibold text-lg tracking-tight">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4">
        <button 
          onClick={openAddJobModal}
          title={isSidebarCollapsed ? "Add Job" : ""}
          className={`mt-4 mb-4 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-md text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 overflow-hidden`}
        >
          <Plus size={18} />
          {!isSidebarCollapsed && <span>Add Job</span>}
        </button>

        {/* Extension Promo Card */}
        {!isSidebarCollapsed && (
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 mt-2 mb-6 group hover:bg-indigo-500/10 transition-all cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-indigo-400 fill-indigo-400/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Browser Clipper</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">
              Clip jobs from LinkedIn in 1-click. No more copy-paste.
            </p>
            <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded border border-indigo-500/20 flex items-center justify-center gap-2 transition-all">
              <Download size={12} />
              Install Extension
            </button>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-zinc-800/50 space-y-1 px-4">
        <a
          title={isSidebarCollapsed ? "Support" : ""}
          className={`flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 transition-colors duration-200 rounded-lg ${isSidebarCollapsed ? "justify-center" : ""}`}
          href="#"
        >
          <HelpCircle size={20} className="text-indigo-500" />
          {!isSidebarCollapsed && (
            <span className="font-semibold text-lg tracking-tight">Support</span>
          )}
        </a>
        <button
          onClick={handleLogout}
          title={isSidebarCollapsed ? "Logout" : ""}
          className={`w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 transition-colors duration-200 rounded-lg ${isSidebarCollapsed ? "justify-center" : ""}`}
        >
          <LogOut size={20} className="text-indigo-500" />
          {!isSidebarCollapsed && (
            <span className="font-semibold text-lg tracking-tight">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
};
