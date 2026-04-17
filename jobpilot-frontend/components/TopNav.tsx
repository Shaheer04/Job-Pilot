import React from "react";
import { Search, LogOut } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useRouter } from "next/navigation";

interface TopNavProps {
  showSearch?: boolean;
}

export const TopNav = ({ showSearch = false }: TopNavProps) => {
  const { jobSearchTerm, setJobSearchTerm } = useUIStore();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center w-full px-6 py-3 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/40 z-10">
      <div className="flex items-center gap-8">
        {showSearch && (
          <div className="relative flex items-center group">
            <Search className="absolute left-4 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              className="bg-surface-container-high/50 border border-outline-variant/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-sm text-white w-96 pl-12 pr-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-zinc-600"
              placeholder="Search by company, title, or skills..."
              type="text"
              value={jobSearchTerm}
              onChange={(e) => setJobSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-indigo-500 overflow-hidden ring-2 ring-zinc-800/50">
            <img
              className="h-full w-full object-cover"
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQL1sxsAJogxw5p7nVg_2JmOfvY9r3VMJUGc3C8Acf2dKKo2FldAhPSSzhwiKcDRU_k6ydWkxI8Lw5r9pVo2dhkvMbcEVAi8f2b6IyLusdtm-EsjPuEOVYx8EyYOmYB65aWze5BUnfjQ1HyTAu4IYBbnwx25BDu3JWMVamm_lj__iIMlmtS74-XL-RgJKqYWUDOOesnqnG4RqI-rhPh6J5T-xDzpkCDOfNazljFZ8wR2Gas1o9h8srfeW1_WFmUh8_W5rMi2JOL0kI"
            />
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-zinc-500 hover:text-error transition-all p-1"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
