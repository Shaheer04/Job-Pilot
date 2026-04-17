import React from "react";
import { Search, Bell } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export const TopNav = () => {
  const { jobSearchTerm, setJobSearchTerm } = useUIStore();

  return (
    <header className="flex justify-between items-center w-full px-6 py-3 h-14 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/40 z-10">
      <div className="flex items-center gap-8">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-zinc-500" size={16} />
          <input
            className="bg-transparent border-none focus:ring-0 text-sm text-zinc-300 w-64 pl-10 outline-none"
            placeholder="Search your jobs..."
            type="text"
            value={jobSearchTerm}
            onChange={(e) => setJobSearchTerm(e.target.value)}
          />
        </div>
        <nav className="hidden md:flex gap-6">
          <a
            className="text-zinc-500 hover:text-zinc-200 transition-all font-medium text-sm tracking-tight"
            href="#"
          >
            Inbox
          </a>
          <a
            className="text-white border-b-2 border-indigo-500 pb-2 transition-all font-medium text-sm tracking-tight"
            href="#"
          >
            My Jobs
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800/50 text-zinc-300 hover:text-white transition-all text-xs font-bold border border-zinc-700/30">
          Quick Add
        </button>
        <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
          <button
            className="text-zinc-500 hover:text-white transition-all p-1"
          >
            <Bell size={18} />
          </button>
          <div className="h-8 w-8 rounded-full bg-indigo-500 overflow-hidden ring-2 ring-zinc-800/50">
            <img
              className="h-full w-full object-cover"
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQL1sxsAJogxw5p7nVg_2JmOfvY9r3VMJUGc3C8Acf2dKKo2FldAhPSSzhwiKcDRU_k6ydWkxI8Lw5r9pVo2dhkvMbcEVAi8f2b6IyLusdtm-EsjPuEOVYx8EyYOmYB65aWze5BUnfjQ1HyTAu4IYBbnwx25BDu3JWMVamm_lj__iIMlmtS74-XL-RgJKqYWUDOOesnqnG4RqI-rhPh6J5T-xDzpkCDOfNazljFZ8wR2Gas1o9h8srfeW1_WFmUh8_W5rMi2JOL0kI"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
