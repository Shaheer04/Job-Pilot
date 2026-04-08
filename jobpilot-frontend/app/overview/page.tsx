"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { AddJobModal } from "@/components/AddJobModal";
import { useHealthScore } from "@/hooks/useHealthScore";

export default function OverviewPage() {
  const router = useRouter();
  const { data: hs, isLoading, error } = useHealthScore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (error) {
    const isAuthError = (error as { response?: { status?: number } }).response?.status === 401;
    return (
      <div className="flex items-center justify-center h-screen bg-surface flex-col gap-4">
        <span className="material-symbols-outlined text-error text-5xl">report</span>
        <div className="text-center">
          <h2 className="text-white font-bold">
            {isAuthError ? "Session Expired" : "Analysis Error"}
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            {isAuthError 
              ? "Your tactical session has ended. Redirecting to login..." 
              : "Unable to retrieve search analytics. Please try again later."}
          </p>
        </div>
        {!isAuthError && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2 bg-surface-container-high border border-outline-variant/20 rounded-md text-xs font-bold hover:bg-surface-bright transition-colors"
          >
            Retry Analysis
          </button>
        )}
      </div>
    );
  }

  // Defensive values to prevent crashes during initial load
  const stats = hs?.stats;
  const stageCounts = stats?.stage_counts || {
    applied: 0,
    followed_up: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    archived: 0
  };

  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-surface relative">
        <TopNav />
        
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-outline-variant/10 pb-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white mb-1">System Overview</h2>
              <p className="text-on-surface-variant font-medium">Welcome back, operative. Here is your weekly status.</p>
            </div>
            <div className="font-mono text-xs text-indigo-400 bg-indigo-400/5 border border-indigo-400/10 px-3 py-1.5 rounded-sm">
              LAST_UPDATE: {new Date().toISOString().split('T')[0]}
            </div>
          </div>

          {/* Bento Layout Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Stat Cards */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-surface-container-low p-5 border border-outline-variant/5 rounded-md hover:bg-surface-container-high transition-colors">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Total Apps</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-white font-mono">{stats?.total_applications || 0}</span>
                  <span className="text-[10px] text-secondary font-bold font-mono">+{stats?.weekly_momentum || 0}</span>
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-surface-container-low p-5 border border-outline-variant/5 rounded-md hover:bg-surface-container-high transition-colors">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Interviews</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-white font-mono">{stageCounts.interview || 0}</span>
                  <span className="text-[10px] text-secondary font-bold font-mono">Active</span>
                </div>
              </div>
              {/* Card 3 */}
              <div className="bg-surface-container-low p-5 border border-outline-variant/5 rounded-md hover:bg-surface-container-high transition-colors">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Offer Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-white font-mono">{stats?.interview_rate || 0}%</span>
                  <span className="text-[10px] text-tertiary font-bold font-mono">KPI</span>
                </div>
              </div>
              {/* Card 4 */}
              <div className="bg-surface-container-low p-5 border border-outline-variant/5 rounded-md hover:bg-surface-container-high transition-colors">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Rejections</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-white font-mono">{stageCounts.rejected || 0}</span>
                  <span className="text-[10px] text-error font-bold font-mono">Stable</span>
                </div>
              </div>

              {/* Gemini Advice Card */}
              <div className="col-span-full bg-gradient-to-br from-surface-container-high to-surface-container p-6 rounded-lg border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h3 className="text-lg font-semibold tracking-tight text-white">AI Strategy for this Week</h3>
                </div>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {hs?.advice.top_3_actions.map((action, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <span className="font-mono text-primary text-xs mt-1">0{i+1}</span>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          {action}
                        </p>
                      </li>
                    ))}
                    {!hs?.advice && <p className="text-sm text-on-surface-variant italic">Add more applications to receive AI tactical advice.</p>}
                  </ul>
                )}
              </div>
            </div>

            {/* AI Health Score */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-8 flex flex-col items-center text-center">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-8">AI Health Score</h3>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle className="text-zinc-800" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="4"></circle>
                    <circle 
                      className="text-secondary drop-shadow-[0_0_8px_rgba(164,201,255,0.4)] transition-all duration-1000" 
                      cx="96" cy="96" 
                      fill="transparent" 
                      r="88" 
                      stroke="currentColor" 
                      strokeDasharray="552.92" 
                      strokeDashoffset={552.92 - (552.92 * (stats?.interview_rate || 0) / 100)} 
                      strokeWidth="6"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white font-mono">{stats?.interview_rate || 0}%</span>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">{stats?.rating || 'Analyzing'}</span>
                  </div>
                </div>
                <div className="mt-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider border border-secondary/20">
                    Based on your recent activity
                  </span>
                  <p className="text-xs text-zinc-500 mt-4 leading-relaxed max-w-[200px] mx-auto">
                    {hs?.advice.summary || "Complete your profile to see how you track against candidates."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Job Modal */}
        <AddJobModal />
      </main>
    </>
  );
}
