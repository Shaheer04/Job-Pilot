"use client";

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
  Send,
  Calendar,
  FileText,
  AlertCircle,
  Edit2,
  Save,
  Trash2,
  Clock,
  ArrowRight,
  PlusCircle,
  ExternalLink
} from "lucide-react";
import { JobApplication, JobStage } from "@/types";
import { useJobDetail } from "@/hooks/useJobDetail";
import { useJobs } from "@/hooks/useJobs";
import { FollowUpModal } from "./FollowUpModal";

interface JobDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobApplication | null;
}

export const JobDetailSheet = ({ isOpen, onClose, job: initialJob }: JobDetailSheetProps) => {
  const { 
    job: fullJob, 
    isLoading: isDetailLoading, 
    addNote, 
    updateJob,
    getFollowup,
    isGeneratingFollowup 
  } = useJobDetail(initialJob?.id);
  
  const { updateStage, deleteJob } = useJobs();
  const [noteContent, setNoteContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditEditForm] = useState<Partial<JobApplication>>({});
  
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpData, setFollowUpData] = useState<any>(null);

  const job = fullJob || initialJob;

  useEffect(() => {
    if (job) {
      setEditEditForm({
        title: job.title,
        company: job.company,
        location: job.location,
        job_type: job.job_type,
        salary_range: job.salary_range,
        description: job.description,
        source: job.source,
        experience_required: job.experience_required,
        key_skills: job.key_skills
      });
    }
  }, [job]);

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

  const handleSaveEdit = async () => {
    await updateJob(editForm);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this application?")) {
      await deleteJob(job.id);
      onClose();
    }
  };

  const handleOpenFollowUpCoach = async () => {
    setIsFollowUpModalOpen(true);
    try {
      const data = await getFollowup();
      setFollowUpData(data);
    } catch (error) {
      setFollowUpData({ error: "Failed to generate follow-up advice. Please try again." });
    }
  };

  const isStale = (new Date().getTime() - new Date(job.updated_at).getTime()) > 7 * 24 * 60 * 60 * 1000;
  const daysSinceApplied = Math.floor((new Date().getTime() - new Date(job.applied_date).getTime()) / (1000 * 60 * 60 * 24));

  const getStageColor = (stage: JobStage) => {
    switch (stage) {
      case 'applied': return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
      case 'assessment': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'followed_up': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'interview': return 'text-primary bg-primary/10 border-primary/20';
      case 'offer': return 'text-tertiary bg-tertiary/10 border-tertiary/20';
      case 'rejected': return 'text-error bg-error/10 border-error/20';
      case 'archived': return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-end">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <section className="relative w-full max-w-2xl bg-surface h-full shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col border-l border-outline-variant/30 transform transition-transform duration-300 ease-out overflow-hidden">
        
        {/* Top Floating Action Bar */}
        <div className="absolute top-6 right-8 flex gap-3 z-10">
          <button 
            onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
            className={`h-10 px-4 flex items-center gap-2 rounded-full transition-all font-bold text-xs uppercase tracking-widest ${
              isEditing 
              ? 'bg-primary text-indigo-950 shadow-lg shadow-primary/20' 
              : 'bg-surface-container-high text-white hover:bg-surface-bright border border-outline-variant/20'
            }`}
          >
            {isEditing ? <Save size={14} /> : <Edit2 size={14} />}
            {isEditing ? "Save" : "Edit"}
          </button>
          <button 
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-high text-white hover:bg-surface-bright border border-outline-variant/20 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Header Section */}
        <header className="px-10 pt-16 pb-8 border-b border-outline-variant/10 bg-gradient-to-b from-surface-container-low/80 to-transparent">
          <div className="max-w-2xl mx-auto">
            {isEditing ? (
              <div className="space-y-4 mb-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Job Title</label>
                  <input 
                    className="w-full bg-surface-container-high border border-primary/20 text-3xl font-black text-white px-4 py-3 rounded-xl focus:ring-4 ring-primary/5 outline-none transition-all"
                    value={editForm.title}
                    onChange={(e) => setEditEditForm({...editForm, title: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Company</label>
                  <input 
                    className="w-full bg-surface-container-high border border-primary/20 text-xl font-bold text-primary px-4 py-2 rounded-xl focus:ring-4 ring-primary/5 outline-none transition-all"
                    value={editForm.company}
                    onChange={(e) => setEditEditForm({...editForm, company: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${getStageColor(job.current_stage)}`}>
                    {job.current_stage.replace('_', ' ')}
                  </div>
                  {isStale && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-error/10 border border-error/20 text-error text-[10px] font-black uppercase tracking-[0.2em]">
                      <AlertCircle size={10} />
                      Stale Application
                    </div>
                  )}
                </div>
                <h2 className="text-4xl font-black tracking-tight text-white leading-[1.1] pr-12">
                  {job.title}
                </h2>
                <div className="flex items-center gap-3">
                  <p className="text-2xl text-primary font-bold tracking-tight">{job.company}</p>
                </div>
              </div>
            )}
            
            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-4 mt-6">
              {!isEditing && (
                <>
                  {job.location && (
                    <div className="flex items-center gap-2 bg-surface-container-high px-3 py-2 rounded-lg border border-outline-variant/10">
                      <MapPin size={14} className="text-outline" />
                      <span className="text-xs font-bold text-on-surface-variant tracking-tight">{job.location}</span>
                    </div>
                  )}
                  {job.job_type && (
                    <div className="flex items-center gap-2 bg-surface-container-high px-3 py-2 rounded-lg border border-outline-variant/10">
                      <Briefcase size={14} className="text-outline" />
                      <span className="text-xs font-bold text-on-surface-variant tracking-tight">{job.job_type}</span>
                    </div>
                  )}
                  {job.salary_range && (
                    <div className="flex items-center gap-2 bg-tertiary/10 px-3 py-2 rounded-lg border border-tertiary/20">
                      <Banknote size={14} className="text-tertiary" />
                      <span className="text-xs font-black text-tertiary tracking-tight font-mono">{job.salary_range}</span>
                    </div>
                  )}
                   <div className="flex items-center gap-2 bg-surface-container-high px-3 py-2 rounded-lg border border-outline-variant/10">
                      <Clock size={14} className="text-outline" />
                      <span className="text-xs font-bold text-on-surface-variant tracking-tight">Applied {daysSinceApplied}d ago</span>
                    </div>
                </>
              )}
            </div>

            {/* Quick Actions (Stage Selection) */}
            {!isEditing && (
              <div className="mt-8 flex items-center gap-4">
                <div className="flex flex-col gap-1.5 flex-1 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-1 flex items-center gap-2 group-focus-within:text-primary transition-colors">
                    <History size={12} />
                    Current Status
                  </label>
                  <div className="relative">
                    <select 
                      value={job.current_stage}
                      onChange={handleStageChange}
                      className="w-full bg-surface-container-low border border-outline-variant/30 text-white text-sm font-bold rounded-xl py-3.5 px-4 focus:ring-4 ring-primary/5 appearance-none cursor-pointer outline-none hover:bg-surface-container-high transition-all"
                    >
                      <option value="applied">Applied</option>
                      <option value="assessment">Assessment</option>
                      <option value="followed_up">Followed Up</option>
                      <option value="interview">Interview Scheduled</option>
                      <option value="offer">Offer Received</option>
                      <option value="rejected">Rejected</option>
                      <option value="archived">Archived</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-1">AI Assistant</label>
                  <button 
                    onClick={handleOpenFollowUpCoach}
                    className="h-[52px] px-6 bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.15em] rounded-xl flex items-center gap-3 hover:bg-primary hover:text-indigo-950 transition-all group shadow-lg shadow-primary/5"
                  >
                    <Sparkles size={16} />
                    Follow-up
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-10">
          <div className="max-w-2xl mx-auto space-y-12">
            
            {/* Edit Mode Inputs */}
            {isEditing && (
              <section className="grid grid-cols-2 gap-6 bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Location</label>
                  <input 
                    className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all"
                    value={editForm.location}
                    onChange={(e) => setEditEditForm({...editForm, location: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Job Type</label>
                  <input 
                    className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all"
                    value={editForm.job_type}
                    onChange={(e) => setEditEditForm({...editForm, job_type: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Salary Range</label>
                  <input 
                    className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-white focus:border-primary outline-none font-mono text-sm transition-all"
                    value={editForm.salary_range}
                    onChange={(e) => setEditEditForm({...editForm, salary_range: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Source</label>
                  <input 
                    className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all"
                    value={editForm.source}
                    onChange={(e) => setEditEditForm({...editForm, source: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Experience Required</label>
                  <input 
                    className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2.5 text-white focus:border-primary outline-none text-sm transition-all"
                    value={editForm.experience_required}
                    onChange={(e) => setEditEditForm({...editForm, experience_required: e.target.value})}
                  />
                </div>
              </section>
            )}

            {/* AI Insights (Compact Version) */}
            {!isEditing && isStale && (
              <div className="bg-error/5 border border-error/20 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-3 bg-error/10 rounded-xl text-error">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">Stale Application Detected</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                    It's been over 7 days since this job was updated. Re-engaging now increases your visibility by 40%.
                  </p>
                  <button 
                    onClick={handleOpenFollowUpCoach}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-error hover:opacity-80 transition-all"
                  >
                    Generate Follow-up Message <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Key Skills */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-outline flex items-center">
                  <Sparkles size={14} className="mr-3 text-primary" />
                  Technical Requirements
                </h4>
              </div>
              
              {isEditing ? (
                <div className="space-y-1.5">
                  <textarea 
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm min-h-[80px] transition-all"
                    value={editForm.key_skills?.join(', ')}
                    onChange={(e) => setEditEditForm({...editForm, key_skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                    placeholder="Comma-separated skills (e.g. React, Node.js, AWS)"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {job.key_skills && job.key_skills.length > 0 ? (
                    job.key_skills.map((skill: string, index: number) => (
                      <span key={index} className="px-4 py-2 bg-surface-container-high border border-outline-variant/10 rounded-xl text-xs font-black text-white shadow-sm hover:border-primary/40 transition-all cursor-default">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <div className="w-full py-6 flex flex-col items-center justify-center border border-dashed border-outline-variant/20 rounded-2xl opacity-40">
                      <p className="text-[10px] font-bold uppercase tracking-widest">No skills analyzed</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Job Description */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-outline flex items-center">
                  <FileText size={14} className="mr-3" />
                  Context & Opportunity
                </h4>
                {job.source && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-outline uppercase tracking-widest">
                    <Globe size={12} />
                    <span>via {job.source}</span>
                  </div>
                )}
              </div>
              
              <div className={`rounded-2xl border border-outline-variant/10 ${isEditing ? 'bg-surface-container-low p-4' : 'bg-surface-container-low/30 p-8'}`}>
                {isEditing ? (
                  <textarea 
                    className="w-full min-h-[400px] bg-transparent text-sm text-on-surface-variant leading-[1.8] outline-none resize-none custom-scrollbar"
                    value={editForm.description}
                    onChange={(e) => setEditEditForm({...editForm, description: e.target.value})}
                    placeholder="Paste full job description here..."
                  />
                ) : job.description ? (
                  <div className="text-[15px] text-on-surface/90 leading-[1.8] font-medium space-y-6">
                    {job.description.split('\n').map((line: string, i: number) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return <div key={i} className="h-4" />;
                      
                      // Heading Detection
                      if ((trimmedLine.length < 60 && trimmedLine.endsWith(':')) || (trimmedLine.length < 50 && trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3)) {
                        return (
                          <h5 key={i} className="text-[11px] font-black uppercase tracking-[0.2em] text-white pt-8 mb-4 border-b border-outline-variant/10 pb-2 inline-block">
                            {trimmedLine}
                          </h5>
                        );
                      }

                      // List Detection
                      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || /^\d+\./.test(trimmedLine)) {
                        return (
                          <div key={i} className="flex gap-4 group pl-2">
                            <span className="text-primary font-black mt-2.5 flex-shrink-0 w-2 h-2 rounded-full border-2 border-primary/40 group-hover:bg-primary group-hover:border-primary transition-all"></span>
                            <span className="flex-1">{trimmedLine.replace(/^[•\-\*\d\.]+\s*/, '')}</span>
                          </div>
                        );
                      }
                      
                      return <p key={i} className="opacity-80">{trimmedLine}</p>;
                    })}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-outline/30 italic text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6 border border-outline-variant/10">
                      <FileText size={24} className="opacity-40" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1">Missing Intel</p>
                    <p className="text-[10px] max-w-[200px] leading-relaxed">Add a description to unlock key skills and follow-up coaching.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Timeline & Notes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Timeline */}
              {!isEditing && (
                <section className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-outline flex items-center">
                    <History size={14} className="mr-3" />
                    Operational Log
                  </h4>
                  <div className="relative space-y-0 pl-4">
                    <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-outline-variant/20 rounded-full"></div>
                    {job.stage_history?.map((history: any, index: number) => (
                      <div key={history.id} className="relative pl-8 pb-8 last:pb-0">
                        <div className={`absolute left-[-5px] top-1.5 w-[10px] h-[10px] rounded-full z-10 ${
                          index === 0 ? "bg-primary shadow-[0_0_15px_rgba(192,193,255,0.6)]" : "bg-outline-variant/40"
                        }`}></div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-black uppercase tracking-widest ${index === 0 ? "text-white" : "text-outline"}`}>
                              {history.stage.replace('_', ' ')}
                            </span>
                            <span className="text-[9px] font-mono text-outline/60 bg-surface-container px-1.5 py-0.5 rounded">
                              {new Date(history.moved_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          {index === 0 && (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary/80 uppercase tracking-tighter">
                              <PlusCircle size={10} />
                              Current Active Stage
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Internal Notes */}
              <section className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-outline flex items-center">
                  <Send size={14} className="mr-3" />
                  Tactical Notes
                </h4>
                
                <div className="space-y-4">
                  {job.notes?.map((note: any) => (
                    <div key={note.id} className="bg-surface-container-low border border-outline-variant/10 p-5 rounded-2xl group hover:border-primary/20 transition-all">
                      <p className="text-sm text-on-surface leading-relaxed font-medium">{note.content}</p>
                      <div className="mt-4 pt-3 border-t border-outline-variant/5 flex justify-between items-center">
                        <span className="text-[9px] font-mono text-outline/50 uppercase tracking-widest">
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>
                        <Send size={10} className="text-outline/20 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Note Input */}
                  <div className="relative mt-4">
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full min-h-[120px] bg-surface-container-high border border-outline-variant/20 rounded-2xl p-5 text-sm text-white placeholder:text-outline/40 focus:ring-4 ring-primary/5 outline-none resize-none transition-all shadow-inner"
                      placeholder="Add a thought, salary info, or interviewer detail..."
                    ></textarea>
                    <button 
                      onClick={handleAddNote}
                      disabled={!noteContent.trim()}
                      className="absolute bottom-4 right-4 bg-primary text-primary-container h-10 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 disabled:opacity-30 transition-all flex items-center gap-2"
                    >
                      Log Note
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Tactical Footer */}
        <footer className="px-10 py-6 bg-surface-container-high/50 border-t border-outline-variant/10 flex items-center gap-6">
          <div className="flex-1 flex items-center gap-4">
            {!isEditing && (
              <button 
                onClick={handleDelete}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-error/5 border border-error/20 text-error hover:bg-error hover:text-white transition-all shadow-sm"
                title="Purge Application"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button 
              onClick={isEditing ? handleSaveEdit : onClose}
              className="flex-1 h-12 bg-primary text-indigo-950 font-black text-[11px] uppercase tracking-[0.25em] rounded-xl shadow-xl shadow-primary/10 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3"
            >
              {isEditing ? <Save size={16} /> : <ArrowRight size={16} />}
              {isEditing ? "Confirm Changes" : "Exit Tactical View"}
            </button>
          </div>
        </footer>

        {/* Follow-up Coach Modal */}
        <FollowUpModal 
          isOpen={isFollowUpModalOpen} 
          onClose={() => {
            setIsFollowUpModalOpen(false);
            setFollowUpData(null);
          }} 
          data={followUpData} 
          isLoading={isGeneratingFollowup} 
        />
      </section>
    </div>
  );
};
