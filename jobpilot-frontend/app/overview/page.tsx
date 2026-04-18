"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { AddJobModal } from "@/components/AddJobModal";
import { useHealthScore } from "@/hooks/useHealthScore";
import { AlertCircle, Zap, Target, TrendingUp, BarChart3, Briefcase } from "lucide-react";

export default function OverviewPage() {
  const router = useRouter();
  const { data: hs, isLoading, error, refetch, isFetching } = useHealthScore();

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
        <AlertCircle className="text-error" size={48} />
        <div className="text-center">
          <h2 className="text-white font-bold">
            {isAuthError ? "Session Expired" : "Analysis Error"}
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            {isAuthError 
              ? "Your session has ended. Redirecting to login..." 
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

  const stats = hs?.stats as any;
  const advice = hs?.advice as any;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-surface relative custom-scrollbar">
        <TopNav />
        
        <div className="p-8 max-w-7xl mx-auto w-full space-y-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-outline-variant/10 pb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white mb-1">Search Insights</h2>
              <p className="text-on-surface-variant font-medium text-sm">Data-driven performance metrics for your job search.</p>
            </div>
            <button 
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-zinc-700 transition-all"
            >
              <TrendingUp size={14} className={`${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Refresh Metrics'}
            </button>
          </div>

          {/* Top Row: Core Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-low p-6 border border-outline-variant/5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-black mb-4">Total Applications</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white font-mono">{stats?.total_applications || 0}</span>
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 border border-outline-variant/5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-black mb-4">Interview Rate</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white font-mono">{stats?.interview_rate || 0}%</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${stats?.rating === 'Healthy' ? 'text-green-400' : 'text-amber-400'}`}>
                  {stats?.rating}
                </span>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 border border-outline-variant/5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-black mb-4">Stale Apps</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white font-mono">{stats?.stale_count || 0}</span>
                <span className="text-[10px] text-error font-black uppercase tracking-widest">Urgent</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 border border-outline-variant/5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-black mb-4">Top Source</p>
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-black text-white truncate max-w-full capitalize">{stats?.source_performance?.[0]?.source || 'None'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Conversion Funnel */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              <div className="bg-surface-container-low p-8 border border-outline-variant/5 rounded-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 className="text-indigo-400" size={20} />
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Application Funnel</h3>
                </div>
                <div className="space-y-8">
                  {stats?.funnel?.map((step: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black uppercase tracking-widest text-outline">{step.stage}</span>
                        <span className="text-sm font-mono font-bold text-white">{step.count} ({step.pct}%)</span>
                      </div>
                      <div className="h-3 w-full bg-surface rounded-full overflow-hidden border border-outline-variant/10">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000"
                          style={{ width: `${step.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Success Table */}
              <div className="bg-surface-container-low p-8 border border-outline-variant/5 rounded-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <Target className="text-indigo-400" size={20} />
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Source Efficiency</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-outline border-b border-outline-variant/10">
                        <th className="pb-4 font-black">Platform</th>
                        <th className="pb-4 font-black">Apps</th>
                        <th className="pb-4 font-black">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {stats?.source_performance?.map((s: any, i: number) => (
                        <tr key={i} className="border-b border-outline-variant/5 last:border-0">
                          <td className="py-4 font-bold text-white capitalize">{s.source}</td>
                          <td className="py-4 text-outline font-mono">{s.count}</td>
                          <td className="py-4">
                            <span className="text-indigo-400 font-black font-mono">{s.rate}%</span>
                          </td>
                        </tr>
                      ))}
                      {!stats?.source_performance?.length && (
                        <tr><td colSpan={3} className="py-8 text-center text-outline italic">No source data available.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar Stats: Skills & Advice */}
            <div className="col-span-12 lg:col-span-5 space-y-8">
              {/* Rule-Based Advice */}
              <div className="bg-indigo-500/5 border border-indigo-500/20 p-8 rounded-2xl relative overflow-hidden">
                <Zap className="absolute top-[-10px] right-[-10px] text-indigo-500/10" size={120} />
                <div className="relative z-10">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-400" />
                    Strategic Actions
                  </h3>
                  <p className="text-sm text-indigo-200/80 leading-relaxed mb-6 font-medium italic">
                    "{advice?.summary}"
                  </p>
                  <ul className="space-y-4">
                    {advice?.actions.map((action: string, i: number) => (
                      <li key={i} className="flex gap-3 items-start bg-zinc-950/40 p-3 rounded-lg border border-white/5">
                        <span className="text-[10px] font-black bg-indigo-500 text-white w-5 h-5 flex items-center justify-center rounded-md shrink-0 mt-0.5">
                          {i+1}
                        </span>
                        <p className="text-xs text-white leading-relaxed font-bold uppercase tracking-tight">
                          {action}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills Heatmap */}
              <div className="bg-surface-container-low p-8 border border-outline-variant/5 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="text-indigo-400" size={20} />
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Requested Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stats?.top_skills?.map((skill: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-surface-container-high px-3 py-2 rounded-lg border border-outline-variant/10 group hover:border-indigo-500/30 transition-all">
                      <span className="text-xs font-bold text-white">{skill.name}</span>
                      <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">
                        {skill.count}
                      </span>
                    </div>
                  ))}
                  {!stats?.top_skills?.length && (
                    <p className="text-xs text-outline italic py-4">Track jobs with descriptions to see skill analytics.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Job Modal */}
        <AddJobModal />
      </main>
    </div>
  );
}
