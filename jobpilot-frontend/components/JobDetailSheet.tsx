import React, { useState, useEffect } from "react";
import { 
  X, 
  ChevronDown, 
  Sparkles, 
  History, 
  MapPin, 
  Globe, 
  Briefcase, 
  Banknote, 
  Send 
} from "lucide-react";
import { JobApplication, JobStage, JobDetail } from "@/types";
import { useJobDetail } from "@/hooks/useJobDetail";
import { useJobs } from "@/hooks/useJobs";

interface JobDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobApplication | null;
}

export const JobDetailSheet = ({ isOpen, onClose, job: initialJob }: JobDetailSheetProps) => {
  const { job: fullJob, isLoading: isDetailLoading, addNote } = useJobDetail(initialJob?.id);
  const { updateStage } = useJobs();
  const [noteContent, setNoteContent] = useState("");

  const job = fullJob || (initialJob as JobDetail | null);

  if (!isOpen || !job) return null;

  const handleStageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStage = e.target.value as JobStage;
    await updateStage({ jobId: job.id, newStage });
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    await addNote(noteContent);
    setNoteContent("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <section className="relative w-full max-w-xl bg-surface h-full shadow-2xl flex flex-col border-l border-outline-variant/30 transform transition-transform duration-300 ease-out">
        {/* Sheet Header */}
        <div className="p-8 border-b border-outline-variant/20">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                {job.title}
              </h2>
              <p className="text-xl text-on-surface-variant font-medium">{job.company}</p>
              
              {/* Job Metadata */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                {job.location && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.source && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Globe size={14} />
                    <span>{job.source}</span>
                  </div>
                )}
                {job.job_type && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Briefcase size={14} />
                    <span>{job.job_type}</span>
                  </div>
                )}
                {job.salary_range && (
                  <div className="flex items-center gap-1.5 text-xs text-tertiary font-bold">
                    <Banknote size={14} />
                    <span>{job.salary_range}</span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                Current Stage
              </label>
              <div className="relative">
                <select 
                  value={job.current_stage}
                  onChange={handleStageChange}
                  className="w-full bg-surface-container border-none text-on-surface text-sm font-semibold rounded-md py-2.5 px-4 focus:ring-1 focus:ring-primary appearance-none cursor-pointer outline-none"
                >
                  <option value="applied">Applied</option>
                  <option value="followed_up">Followed Up</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-2.5 pointer-events-none text-on-surface-variant" />
              </div>
            </div>
            <div className="mono text-[10px] bg-tertiary/10 text-tertiary px-3 py-1.5 rounded-sm border border-tertiary/20 self-end font-mono uppercase">
              {job.current_stage.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
          {/* Smart Follow-up Coach */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles size={40} className="text-primary/20" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter bg-primary text-on-primary-container px-2 py-0.5 rounded">
                  Coach AI
                </span>
                <h4 className="text-sm font-bold text-white">Follow-up Recommendation</h4>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">
                {job.days_since_applied >= 7 ? "It's been a week since your last update. Time to check in!" : "You applied recently. Wait a few more days before following up."}
              </p>
              <button className="w-full py-3 bg-primary text-on-primary-container text-xs font-black uppercase tracking-widest rounded-md hover:bg-primary-container transition-all flex items-center justify-center space-x-2">
                <Sparkles size={14} />
                <span>Get AI Advice</span>
              </button>
            </div>
          </div>

          {/* Timeline (Stage History) */}
          <section>
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center">
              <History size={14} className="mr-2" />
              Stage History
            </h4>
            <div className="space-y-0 relative">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-outline-variant/30"></div>
              {job.stage_history?.map((history, index) => (
                <div key={history.id} className="relative pl-8 pb-8 group">
                  <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full bg-surface border-2 ${index === 0 ? "border-primary" : "border-outline-variant/50"} z-10`}></div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-bold ${index === 0 ? "text-white" : "text-on-surface-variant"} capitalize`}>
                        {history.stage.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-[10px] text-on-surface-variant">
                        {new Date(history.moved_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notes Area */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Interview Notes
              </h4>
              <span className="font-mono text-[10px] text-primary">Saved in cloud</span>
            </div>
            <div className="space-y-4 mb-4">
              {job.notes?.map(note => (
                <div key={note.id} className="bg-surface-container-low p-3 rounded border border-outline-variant/10 text-sm">
                  <p className="text-on-surface">{note.content}</p>
                  <span className="text-[10px] text-outline mt-1 block">
                    {new Date(note.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative group">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full min-h-[120px] bg-surface-container-low border-b border-outline-variant focus:border-primary transition-all p-4 text-sm text-on-surface placeholder:text-outline/50 resize-none outline-none"
                placeholder="Jot down salary discussions, interviewer names..."
              ></textarea>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button 
                  onClick={handleAddNote}
                  className="bg-primary text-on-primary-container p-1.5 rounded hover:bg-primary-container transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/20 flex space-x-3">
          <button 
            onClick={() => updateStage({ jobId: job.id, newStage: 'archived' })}
            className="flex-1 py-3 bg-surface-container-highest border border-outline-variant/20 text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-surface-bright transition-all"
          >
            Archive Job
          </button>
          <button 
            onClick={onClose}
            className="flex-[2] py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary-container text-xs font-black uppercase tracking-widest rounded-md shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
          >
            Done
          </button>
        </div>
      </section>
    </div>
  );
};
