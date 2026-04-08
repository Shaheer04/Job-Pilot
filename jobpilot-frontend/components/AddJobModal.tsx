"use client";

import React, { useState } from "react";
import { useUIStore } from "@/store/uiStore";
import { useJobs } from "@/hooks/useJobs";

export const AddJobModal = () => {
  const { isAddJobModalOpen, closeAddJobModal, showToast } = useUIStore();
  const { createJob, extractJob, isExtracting } = useJobs();
  
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isAddJobModalOpen) return null;

  const cleanText = (text: string) => {
    return text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu, '') // Remove emojis
      .replace(/[^\S\r\n]+/g, ' ') // Collapse multiple horizontal spaces, but keep newlines
      .replace(/\n{3,}/g, '\n\n') // Collapse 3+ newlines into just 2
      .trim();
  };

  const handleExtract = async () => {
    if (!description.trim()) {
      showToast("Please paste a description");
      return;
    }
    
    const cleanedDescription = cleanText(description);
    showToast("AI analyzing description...");
    try {
      const data = await extractJob(cleanedDescription);
      
      setCompany(data.company || "");
      setTitle(data.title || "");
      setSource(data.source || "");
      setLocation(data.location || "");
      setJobType(data.job_type || "");
      setSalaryRange(data.salary_range || "");
      
      showToast("Details extracted!");
    } catch (error: unknown) {
      console.error("AI extraction failed:", error);
      showToast("AI extraction failed");
    }
  };

  const handleAddJob = async () => {
    if (!company || !title) return;
    setIsLoading(true);
    try {
      await createJob({
        title,
        company,
        description,
        source,
        location,
        job_type: jobType,
        salary_range: salaryRange,
      });
      // Clear and close
      setDescription("");
      setCompany("");
      setTitle("");
      setSource("");
      setLocation("");
      setJobType("");
      setSalaryRange("");
      showToast("Job added successfully");
      closeAddJobModal();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: any } };
      if (err.response?.status === 400) {
        console.error("Validation Errors:", err.response.data);
        showToast("Check input fields");
      } else {
        console.error("Failed to add job:", error);
        showToast("Failed to add job");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-surface border border-outline-variant/20 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Add New Job</h2>
          </div>
          <button 
            onClick={closeAddJobModal}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-hide">
          <div className="space-y-8">
            {/* Step 1: Input Flow */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Step 1: Paste Job Description
                </label>
                <button 
                  onClick={handleExtract}
                  disabled={isExtracting || !description.trim()}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
                    isExtracting 
                      ? "bg-primary/10 border-primary text-primary animate-pulse" 
                      : "bg-primary text-on-primary-container border-primary hover:brightness-110 shadow-lg shadow-primary/20"
                  }`}
                >
                  {isExtracting ? "Extracting..." : "Auto-fill with AI"}
                </button>
              </div>
              <div className="relative">
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-40 bg-surface-container-low rounded-lg p-4 text-on-surface placeholder:text-zinc-600 border border-outline-variant/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none text-sm leading-relaxed outline-none" 
                  placeholder="Paste the full job description here..."
                ></textarea>
              </div>
            </section>

            {/* Step 2: Confirmation Area */}
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-4 mb-6">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Step 2: Confirm Details
                </label>
                <div className="h-px flex-1 bg-outline-variant/10"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 ml-1">Company Name</label>
                  <input 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all" 
                    type="text" 
                    placeholder="e.g. Google"
                  />
                </div>

                {/* Job Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 ml-1">Job Title</label>
                  <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all" 
                    type="text" 
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 ml-1">Location</label>
                  <input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all" 
                    type="text" 
                    placeholder="e.g. Remote"
                  />
                </div>

                {/* Job Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 ml-1">Job Type</label>
                  <input 
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all" 
                    type="text" 
                    placeholder="e.g. Full-time"
                  />
                </div>

                {/* Salary Range */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 ml-1">Salary Range</label>
                  <input 
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all" 
                    type="text" 
                    placeholder="e.g. $120k - $150k"
                  />
                </div>

                {/* Source */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 ml-1">Source</label>
                  <input 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all" 
                    type="text" 
                    placeholder="e.g. LinkedIn"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-8 py-6 bg-zinc-900 border-t border-outline-variant/10 flex items-center justify-end gap-4">
          <button 
            onClick={closeAddJobModal}
            className="px-6 py-2.5 rounded-md text-sm font-bold text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddJob}
            disabled={isLoading || isExtracting || !company || !title}
            className="px-8 py-2.5 rounded-md bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? "Adding..." : "Add to Tracker"}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
