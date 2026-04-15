"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Target, BarChart3, Briefcase, MousePointer2, ClipboardList, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const PlaneLogo = ({ className = "w-8 h-8" }) => (
    <div className={`${className} bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
      <svg width="70%" height="70%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
      </svg>
    </div>
  );

  return (
    <div className="bg-surface text-on-surface antialiased overflow-x-hidden min-h-screen relative font-body">
      {/* TopNavBar Mapping */}
      <nav className="fixed top-0 left-0 w-full z-50 glass-nav flex justify-between items-center px-6 py-3 h-14">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <PlaneLogo className="w-7 h-7" />
            <span className="text-xl font-black text-white tracking-tighter">JobPilot</span>
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link className="text-zinc-500 hover:text-zinc-200 transition-all text-sm font-medium tracking-tight" href={isLoggedIn ? "/jobs" : "/login"}>Mission Control</Link>
            <Link className="text-zinc-500 hover:text-zinc-200 transition-all text-sm font-medium tracking-tight" href={isLoggedIn ? "/jobs" : "/login"}>Analytics</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 px-3 py-1 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-all">
            <span className="material-symbols-outlined text-sm">search</span>
            <span className="mono text-xs opacity-50">Search...</span>
          </button>
          {isLoggedIn ? (
            <Link href="/jobs" className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all">
                Login
              </Link>
              <Link href="/register" className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main className="relative pt-32">
        <div className="hero-glow"></div>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 text-center relative z-10 mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
            <PlaneLogo className="w-4 h-4 rounded-sm" />
            <span className="mono text-[10px] text-indigo-400 tracking-widest uppercase font-bold">A Smarter Way to Track Your Search</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.05]">
            Stop losing track of your <br/>
            <span className="gradient-text">job search.</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Tired of messy spreadsheets and forgotten applications? JobPilot is your simple, smart tracker. Organize your jobs, get timely reminders, and land your next role with confidence.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href={isLoggedIn ? "/jobs" : "/register"} className="px-8 py-4 bg-indigo-500 text-white font-bold rounded-lg shadow-xl shadow-indigo-500/20 hover:translate-y-[-2px] transition-all inline-block active:scale-95">
              {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
            </Link>
            <button className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-800 transition-all flex items-center gap-2 group">
              <MousePointer2 className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
              See how it works
            </button>
          </div>

          {/* Problem Statement Strip */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto opacity-70">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <ClipboardList className="text-red-400" size={20} />
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">"I forgot which company sent me that coding challenge link."</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="text-orange-400" size={20} />
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">"Did I follow up with Stripe? Was it LinkedIn or Email?"</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Target className="text-purple-400" size={20} />
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">"Applying feels like screaming into a void with no feedback."</p>
            </div>
          </div>
        </section>

        {/* Dash Preview */}
        <section className="max-w-6xl mx-auto px-6 mb-32 relative">
          <div className="relative mx-auto max-w-5xl bg-zinc-900 rounded-2xl border border-zinc-800 p-2 shadow-2xl shadow-black/50 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
             <img alt="Dashboard Preview" className="w-full h-auto rounded-xl opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK0_gqCSuCwnZQ3vz5SF5tREP3gA61lJCbxt6SWrMI5MZ7QNOPbIIyhkgJW9eXHSMPuaRfJ88DbO0yFpokFIrKGw2JyE7PGsbba84wWCSfhWwwodKH5FU3uPVZ7hWHMbQKySKNqccmByExq3eJTGH-Sm5ZZBjCxO15ikwe9P4sK04Hvpd1CY5tuQjFF2iy1aVPZMpOFz9o1PmlCZSKxgMrr2T4yDfBSuf-WvBfdkPrZboN2oxGhyBmeONaehBwxQlgIUcIAJ5O1kba"/>
             
             {/* Floating UI Elements */}
             <div className="absolute bottom-10 right-10 bg-zinc-950 border border-indigo-500/30 p-4 rounded-xl shadow-2xl max-w-xs hidden lg:block transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-indigo-400 fill-indigo-400/20" size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Smart Alert</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "You haven't checked in with <span className="text-white font-bold">Linear</span> in 5 days. High ghosting probability. <span className="text-indigo-400 underline cursor-pointer">Draft nudge?</span>"
                </p>
             </div>
          </div>
        </section>

        {/* Features Section (Bento Grid) */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">Smart tools for your search</h2>
            <p className="text-on-surface-variant font-medium text-lg max-w-2xl mx-auto">Land your next role without the manual work.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="md:col-span-2 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 flex flex-col md:flex-row gap-8 items-center group overflow-hidden">
              <div className="flex-1 text-left">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                  <ClipboardList className="text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Easy Job Tracking</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  Paste a LinkedIn URL or raw text. Our smart tracker handles the details, building a clear history of every application.
                </p>
                <div className="flex gap-2">
                  <span className="mono text-[10px] bg-zinc-800 px-3 py-1.5 rounded-lg text-indigo-400 uppercase font-black tracking-widest border border-zinc-700">Kanban Board</span>
                  <span className="mono text-[10px] bg-zinc-800 px-3 py-1.5 rounded-lg text-indigo-400 uppercase font-black tracking-widest border border-zinc-700">Quick Save</span>
                </div>
              </div>
              <div className="flex-1 relative w-full h-48 md:h-full min-h-[200px] overflow-hidden rounded-xl border border-zinc-800 shadow-2xl transition-transform group-hover:scale-[1.02]">
                <img alt="Kanban View" className="absolute inset-0 w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK0_gqCSuCwnZQ3vz5SF5tREP3gA61lJCbxt6SWrMI5MZ7QNOPbIIyhkgJW9eXHSMPuaRfJ88DbO0yFpokFIrKGw2JyE7PGsbba84wWCSfhWwwodKH5FU3uPVZ7hWHMbQKySKNqccmByExq3eJTGH-Sm5ZZBjCxO15ikwe9P4sK04Hvpd1CY5tuQjFF2iy1aVPZMpOFz9o1PmlCZSKxgMrr2T4yDfBSuf-WvBfdkPrZboN2oxGhyBmeONaehBwxQlgIUcIAJ5O1kba"/>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 flex flex-col text-left group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 border border-amber-500/20">
                <Target className="text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Search Insights</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed flex-1">
                Is your search stalling? Get a real-time health score based on your progress and application updates.
              </p>
              <div className="mt-8 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="stroke-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                    <path className="stroke-indigo-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="82, 100" strokeLinecap="round" strokeWidth="3"></path>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="mono text-2xl font-black text-white">82%</span>
                    <span className="text-[8px] font-black uppercase text-indigo-400">On Track</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 flex flex-col text-left">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <Zap className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Follow-up Assistant</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Draft perfect, friendly nudge emails. We suggest the right tone and timing based on your last interaction.
              </p>
            </div>
            {/* Card 4 (Tactical Archive focus) */}
            <div className="md:col-span-2 bg-zinc-950 rounded-2xl border border-zinc-800 p-8 overflow-hidden relative group text-left">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                    <ShieldCheck className="text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Full Application History</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  Every job description, interview note, and resume is kept in one place. Never lose track of where you stand.
                </p>
                <Link href="/register" className="text-indigo-400 text-xs font-black tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all">
                  Get Started Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-500/5 translate-x-12 -skew-x-12 hidden md:block group-hover:bg-indigo-500/10 transition-colors"></div>
            </div>
          </div>
        </section>

        {/* Relatability Section */}
        <section className="max-w-4xl mx-auto px-6 mb-32 py-16 border-t border-zinc-800/40">
           <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-12 tracking-tight">Built by developers, for developers.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                 <div>
                    <h4 className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-4">The Problem</h4>
                    <p className="text-on-surface-variant leading-relaxed">
                        Job searching has become a data management nightmare. LinkedIn "Applied" lists are buggy, spreadsheets are manual and tedious, and ghosting is at an all-time high. 
                    </p>
                 </div>
                 <div>
                    <h4 className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-4">The Solution</h4>
                    <p className="text-on-surface-variant leading-relaxed">
                        A dedicated, high-density tracker that acts as your second brain. We automate the logging, analyze your funnel health, and tell you exactly when to follow up.
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-6 mb-32">
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent)] pointer-events-none"></div>
            <PlaneLogo className="w-12 h-12 mx-auto mb-8 shadow-indigo-500/40" />
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tighter">Ready to pilot your career?</h2>
            <p className="text-on-surface-variant mb-10 max-w-lg mx-auto font-medium text-lg">Join 50,000+ professionals using JobPilot to land their next role with zero stress.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link href={isLoggedIn ? "/jobs" : "/register"} className="w-full md:w-auto px-12 py-5 bg-indigo-500 text-white font-black rounded-xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                {isLoggedIn ? "View My Tracker" : "Get Started Free"}
              </Link>
              <span className="text-zinc-600 mono text-xs uppercase tracking-[0.2em] font-bold">Free forever for individuals</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 py-20 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-left">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <PlaneLogo className="w-7 h-7" />
                <span className="text-xl font-black text-white tracking-tighter">JobPilot</span>
              </Link>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The professional standard for job application tracking. Built for the modern, high-performance workforce.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <p className="mono text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Product</p>
                <ul className="space-y-2">
                  <li><Link className="text-sm text-zinc-400 hover:text-white transition-colors" href="#">Mission Control</Link></li>
                  <li><Link className="text-sm text-zinc-400 hover:text-white transition-colors" href="#">Health Analytics</Link></li>
                  <li><Link className="text-sm text-zinc-400 hover:text-white transition-colors" href="#">Pricing</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="mono text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Company</p>
                <ul className="space-y-2">
                  <li><Link className="text-sm text-zinc-400 hover:text-white transition-colors" href="#">Privacy</Link></li>
                  <li><Link className="text-sm text-zinc-400 hover:text-white transition-colors" href="#">Terms</Link></li>
                  <li><Link className="text-sm text-zinc-400 hover:text-white transition-colors" href="#">Open Source</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="mono text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Resources</p>
                <ul className="space-y-2">
                  <li><Link className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2" href="#">GitHub <span className="material-symbols-outlined text-sm">open_in_new</span></Link></li>
                  <li><Link className="text-sm text-zinc-400 hover:text-white transition-colors" href="#">Support</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="mono text-[10px] text-zinc-600 uppercase tracking-widest font-bold">© 2024 JobPilot Tactical Systems Inc.</p>
            <div className="flex gap-6">
              <span className="material-symbols-outlined text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">language</span>
              <span className="material-symbols-outlined text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">share</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
