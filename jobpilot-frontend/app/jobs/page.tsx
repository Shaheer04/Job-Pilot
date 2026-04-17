"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { KanbanBoard } from "@/components/KanbanBoard";
import { JobDetailSheet } from "@/components/JobDetailSheet";
import { AddJobModal } from "@/components/AddJobModal";
import { useJobs } from "@/hooks/useJobs";
import { useUIStore } from "@/store/uiStore";
import { JobApplication } from "@/types";

export default function Home() {
  const router = useRouter();
  const { jobSearchTerm } = useUIStore();
  const { jobs, isLoading, error } = useJobs(jobSearchTerm);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleCardClick = (job: JobApplication) => {
    setSelectedJob(job);
  };

  const handleCloseSheet = () => {
    setSelectedJob(null);
  };

  if (error) {
    const isAuthError = (error as { response?: { status?: number } }).response?.status === 401;
    return (
      <div className="flex items-center justify-center h-screen bg-surface flex-col gap-4">
        <span className="material-symbols-outlined text-error text-5xl">report</span>
        <div className="text-center">
          <h2 className="text-white font-bold">
            {isAuthError ? "Session Expired" : "Connection Error"}
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            {isAuthError 
              ? "Your session has ended. Redirecting to login..." 
              : "Unable to connect to your dashboard. Please check your network connection."}
          </p>
        </div>
        {!isAuthError && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2 bg-surface-container-high border border-outline-variant/20 rounded-md text-xs font-bold hover:bg-surface-bright transition-colors"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-surface relative">
        <TopNav showSearch />
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        ) : (
          <KanbanBoard jobs={jobs} onCardClick={handleCardClick} />
        )}
        
        {/* Detailed Job View Overlay */}
        <JobDetailSheet 
          isOpen={!!selectedJob} 
          onClose={handleCloseSheet} 
          job={selectedJob} 
        />

        {/* Add Job Modal */}
        <AddJobModal />
      </main>
    </div>
  );
}
