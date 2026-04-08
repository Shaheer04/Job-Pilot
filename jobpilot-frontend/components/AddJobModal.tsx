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
  const [isLoading, setIsLoading] = useState(false);

  if (!isAddJobModalOpen) return null;

  const handleExtract = async () => {
    if (!description.trim()) {
      showToast("Please paste a job description first");
      return;
    }
    
    showToast("AI: ANALYZING_BUFFER...");
    try {
      const data = await extractJob(description);
      setCompany(data.company || "");
      setTitle(data.title || "");
      setSource(data.source || "");
      showToast("AI: EXTRACTION_COMPLETE");
    } catch (error) {
      console.error("AI extraction failed:", error);
      showToast("AI: EXTRACTION_FAILED");
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
      });
      // Clear and close
      setDescription("");
      setCompany("");
      setTitle("");
      setSource("");
      showToast("JOB_ARCHIVED_SUCCESSFULLY");
      closeAddJobModal();
    } catch (error) {
      console.error("Failed to add job:", error);
      showToast("ARCHIVE_OPERATION_FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface/60 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-surface-container-low rounded-xl shadow-2xl shadow-black/60 border border-outline-variant/15 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-8 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">add_box</span>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Add Job</h2>
          </div>
          <button 
            onClick={closeAddJobModal}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors text-white"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
          <div className="space-y-10">
            {/* Step 1: Input Flow */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <label className="font-mono text-xs text-primary font-medium tracking-widest uppercase">
                  Step 01 / Job Data
                </label>
                <button 
                  onClick={handleExtract}
                  disabled={isExtracting || !description.trim()}
                  className={`font-mono text-[10px] px-2 py-1 rounded border border-primary/20 transition-all flex items-center gap-2 ${
                    isExtracting ? "bg-primary/10 text-primary animate-pulse" : "text-on-surface-variant hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  {isExtracting ? "AI_EXTRACTING..." : "AI_PARSER: READY"}
                </button>
              </div>
              <div className="relative group">
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-48 bg-surface-container rounded-lg p-6 text-on-surface placeholder:text-outline border-none focus:ring-1 focus:ring-primary/50 transition-all resize-none text-base leading-relaxed outline-none" 
                  placeholder="Paste Job Description text here..."
                ></textarea>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <span className="font-mono text-[10px] text-on-surface-variant">LINES: {description.split('\n').filter(l => l).length.toString().padStart(2, '0')}</span>
                  <span className="font-mono text-[10px] text-on-surface-variant">CHARS: {description.length.toString().padStart(3, '0')}</span>
                </div>
              </div>
            </section>

            {/* Step 2: Confirmation Area */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-outline-variant/20"></div>
                <label className="font-mono text-xs text-on-surface-variant font-medium tracking-widest uppercase">
                  Step 02 / Confirm Details
                </label>
                <div className="h-px flex-1 bg-outline-variant/20"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase ml-1">
                    Company Name
                  </label>
                  <div className="relative group">
                    <input 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary px-1 py-3 text-white transition-colors placeholder:text-outline-variant focus:ring-0 outline-none" 
                      type="text" 
                      placeholder="e.g. Starlight Systems"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                      <span className={`material-symbols-outlined text-[16px] transition-colors ${company ? 'text-tertiary' : 'text-outline-variant'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                      </span>
                    </div>
                  </div>
                </div>
                {/* Job Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase ml-1">
                    Job Title
                  </label>
                  <div className="relative group">
                    <input 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary px-1 py-3 text-white transition-colors placeholder:text-outline-variant focus:ring-0 outline-none" 
                      type="text" 
                      placeholder="e.g. Lead Interface Designer"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                      <span className={`material-symbols-outlined text-[16px] transition-colors ${title ? 'text-tertiary' : 'text-outline-variant'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                      </span>
                    </div>
                  </div>
                </div>
                {/* Source */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase ml-1">
                    Source
                  </label>
                  <div className="relative group">
                    <input 
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary px-1 py-3 text-white transition-colors placeholder:text-outline-variant focus:ring-0 outline-none" 
                      type="text" 
                      placeholder="e.g. LinkedIn"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                      <span className={`material-symbols-outlined text-[16px] transition-colors ${source ? 'text-tertiary' : 'text-outline-variant'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-8 py-6 bg-surface-container border-t border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className="font-mono text-[10px] tracking-tight">AUTO-PROCESS: ON</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={closeAddJobModal}
              className="px-6 py-2.5 rounded-md text-sm font-medium text-on-surface-variant hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddJob}
              disabled={isLoading || isExtracting || !company || !title}
              className="px-8 py-2.5 rounded-md bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? "Adding..." : "Add to Tracker"}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
