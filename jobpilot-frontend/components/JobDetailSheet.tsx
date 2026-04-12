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
  Trash2
} from "lucide-react";
import { JobApplication, JobStage } from "@/types";
import { useJobDetail } from "@/hooks/useJobDetail";
import { useJobs } from "@/hooks/useJobs";

interface JobDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobApplication | null;
}

export const JobDetailSheet = ({ isOpen, onClose, job: initialJob }: JobDetailSheetProps) => {
  const { job: fullJob, isLoading: isDetailLoading, addNote, updateJob } = useJobDetail(initialJob?.id);
  const { updateStage, deleteJob } = useJobs();
  const [noteContent, setNoteContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditEditForm] = useState<Partial<JobApplication>>({});

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

  const isStale = (new Date().getTime() - new Date(job.updated_at).getTime()) > 7 * 24 * 60 * 60 * 1000;
  const daysSinceApplied = Math.floor((new Date().getTime() - new Date(job.applied_date).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <section className="relative w-full max-w-xl bg-surface h-full shadow-2xl flex flex-col border-l border-outline-variant/30 transform transition-transform duration-300 ease-out overflow-hidden">
        {/* Sheet Header */}
        <div className="p-8 border-b border-outline-variant/20 bg-surface-container-low/50">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1 flex-1 pr-4">
              {isEditing ? (
                <div className="space-y-3 mb-4">
                  <input 
                    className="w-full bg-zinc-950 border border-indigo-500/30 text-2xl font-black text-white px-3 py-2 rounded-lg focus:ring-2 ring-indigo-500/20 outline-none"
                    value={editForm.title}
                    onChange={(e) => setEditEditForm({...editForm, title: e.target.value})}
                    placeholder="Job Title"
                  />
                  <input 
                    className="w-full bg-zinc-950 border border-indigo-500/30 text-lg font-bold text-indigo-400 px-3 py-1.5 rounded-lg focus:ring-2 ring-indigo-500/20 outline-none"
                    value={editForm.company}
                    onChange={(e) => setEditEditForm({...editForm, company: e.target.value})}
                    placeholder="Company"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <p className="text-xl text-primary font-medium">{job.company}</p>
                    {isStale && (
                      <span className="flex items-center gap-1 text-[10px] bg-error-container/20 text-error px-2 py-0.5 rounded border border-error/20 font-bold uppercase tracking-wider">
                        <AlertCircle size={10} />
                        Stale
                      </span>
                    )}
                  </div>
                </>
              )}
              
              {/* Job Metadata Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
                {isEditing ? (
                  <>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-outline" />
                      <input 
                        className="bg-transparent border-b border-outline-variant/30 text-xs text-on-surface p-1 w-full outline-none focus:border-primary"
                        value={editForm.location}
                        onChange={(e) => setEditEditForm({...editForm, location: e.target.value})}
                        placeholder="Location"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-outline" />
                      <input 
                        className="bg-transparent border-b border-outline-variant/30 text-xs text-on-surface p-1 w-full outline-none focus:border-primary"
                        value={editForm.job_type}
                        onChange={(e) => setEditEditForm({...editForm, job_type: e.target.value})}
                        placeholder="Job Type"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Banknote size={14} className="text-outline" />
                      <input 
                        className="bg-transparent border-b border-outline-variant/30 text-xs text-on-surface p-1 w-full outline-none focus:border-primary"
                        value={editForm.salary_range}
                        onChange={(e) => setEditEditForm({...editForm, salary_range: e.target.value})}
                        placeholder="Salary Range"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-outline" />
                      <input 
                        className="bg-transparent border-b border-outline-variant/30 text-xs text-on-surface p-1 w-full outline-none focus:border-primary"
                        value={editForm.source}
                        onChange={(e) => setEditEditForm({...editForm, source: e.target.value})}
                        placeholder="Source"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-outline" />
                      <input 
                        className="bg-transparent border-b border-outline-variant/30 text-xs text-on-surface p-1 w-full outline-none focus:border-primary"
                        value={editForm.experience_required}
                        onChange={(e) => setEditEditForm({...editForm, experience_required: e.target.value})}
                        placeholder="Experience (e.g. 3+ yrs)"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {job.location && (
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                        <MapPin size={14} className="text-outline" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.job_type && (
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                        <Briefcase size={14} className="text-outline" />
                        <span>{job.job_type}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Calendar size={14} className="text-outline" />
                      <span>Applied {daysSinceApplied} days ago</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-xs text-tertiary font-bold">
                        <Banknote size={14} />
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                    {job.source && (
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant col-span-2">
                        <Globe size={14} className="text-outline" />
                        <span>Source: <span className="text-white font-medium">{job.source}</span></span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
                className={`h-10 w-10 flex items-center justify-center rounded-full transition-all ${isEditing ? 'bg-primary text-indigo-900' : 'hover:bg-surface-bright text-white'}`}
                title={isEditing ? "Save Changes" : "Edit Job"}
              >
                {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
              </button>
              <button 
                onClick={onClose}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-surface-container p-3 rounded-lg border border-outline-variant/10">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1.5 ml-1">
                Move to Stage
              </label>
              <div className="relative">
                <select 
                  value={job.current_stage}
                  onChange={handleStageChange}
                  className="w-full bg-surface-container-low border border-outline-variant/20 text-on-surface text-sm font-semibold rounded-md py-2 px-3 focus:ring-1 focus:ring-primary appearance-none cursor-pointer outline-none hover:border-outline-variant transition-colors"
                >
                  <option value="applied">Applied</option>
                  <option value="followed_up">Followed Up</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="offer">Offer Received</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 pointer-events-none text-outline" />
              </div>
            </div>
            <div className="flex flex-col items-end justify-center px-4 border-l border-outline-variant/20">
               <span className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Status</span>
               <span className="text-xs font-black text-primary uppercase tracking-tighter">
                {job.current_stage.replace('_', ' ')}
               </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-12">
          
          {/* Important Updates / AI Recommendations */}
          {!isEditing && (
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mb-4 flex items-center">
                <Sparkles size={14} className="mr-2 text-primary" />
                Insights & Next Steps
              </h4>
              <div className="bg-primary/5 rounded-xl border border-primary/10 p-5 relative overflow-hidden">
                <div className="absolute top-[-10px] right-[-10px] opacity-10">
                  <Sparkles size={80} className="text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles size={18} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white mb-1">Follow-up Strategy</h5>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
                        {isStale 
                          ? "This application has gone stale. We recommend sending a polite follow-up to the hiring manager to express your continued interest."
                          : "Your application is still fresh. Focus on preparing for potential technical interviews or researching the company culture."}
                      </p>
                      {job.experience_required && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                            {job.experience_required}
                          </span>
                          <span className="text-[10px] text-outline italic">Required Experience</span>
                        </div>
                      )}
                      <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-container transition-colors group">
                        Open Follow-up Coach
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Key Skills Section */}
          <section>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mb-4 flex items-center">
              <Sparkles size={14} className="mr-2 text-primary" />
              Required Key Skills
            </h4>
            {isEditing ? (
              <input 
                className="w-full bg-zinc-950 border border-outline-variant/30 text-xs text-on-surface p-3 rounded-lg outline-none focus:border-primary"
                value={editForm.key_skills?.join(', ')}
                onChange={(e) => setEditEditForm({...editForm, key_skills: e.target.value.split(',').map(s => s.trim())})}
                placeholder="React, TypeScript, Python..."
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {job.key_skills && job.key_skills.length > 0 ? (
                  job.key_skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-surface-container-high border border-outline-variant/20 rounded-lg text-xs font-medium text-white shadow-sm hover:border-primary/30 transition-colors">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-[10px] text-outline italic">No skills listed.</p>
                )}
              </div>
            )}
          </section>

          {/* Job Description Section */}
          <section>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mb-4 flex items-center">
              <FileText size={14} className="mr-2" />
              Job Description
            </h4>
            <div className="bg-surface-container-low/30 rounded-lg border border-outline-variant/10 p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
              {isEditing ? (
                <textarea 
                  className="w-full min-h-[300px] bg-transparent text-sm text-on-surface-variant leading-relaxed outline-none resize-none"
                  value={editForm.description}
                  onChange={(e) => setEditEditForm({...editForm, description: e.target.value})}
                />
              ) : job.description ? (
                <div className="text-sm text-on-surface-variant leading-relaxed font-body space-y-4">
                  {job.description.split('\n').map((line, i) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return <div key={i} className="h-2" />;
                    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || /^\d+\./.test(trimmedLine)) {
                      return (
                        <div key={i} className="flex gap-3 pl-2 group">
                          <span className="text-primary font-bold mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                          <span className="flex-1 text-on-surface/90">{trimmedLine.replace(/^[•\-\*\d\.]+\s*/, '')}</span>
                        </div>
                      );
                    }
                    if ((trimmedLine.length < 50 && trimmedLine.endsWith(':')) || (trimmedLine.length < 40 && trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3)) {
                      return (
                        <h5 key={i} className="text-xs font-black uppercase tracking-wider text-white mt-6 mb-2 border-l-2 border-primary/30 pl-3">
                          {trimmedLine}
                        </h5>
                      );
                    }
                    return <p key={i} className="text-on-surface/80 leading-relaxed">{trimmedLine}</p>;
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-outline/50 italic text-sm text-center">
                  <FileText size={32} className="mb-3 opacity-20" />
                  <p>No description provided for this job.</p>
                </div>
              )}
            </div>
          </section>

          {/* Timeline */}
          {!isEditing && (
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mb-6 flex items-center">
                <History size={14} className="mr-2" />
                Application Timeline
              </h4>
              <div className="space-y-0 relative">
                <div className="absolute left-2.5 top-2 bottom-2 w-[1px] bg-gradient-to-b from-primary/50 to-transparent"></div>
                {job.stage_history?.map((history, index) => (
                  <div key={history.id} className="relative pl-10 pb-8 last:pb-0">
                    <div className={`absolute left-0 top-1 w-5 h-5 rounded-full bg-surface border-2 ${index === 0 ? "border-primary" : "border-outline-variant/30"} z-10 flex items-center justify-center shadow-[0_0_10px_rgba(192,193,255,0.1)]`}>
                      {index === 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-bold ${index === 0 ? "text-white" : "text-on-surface-variant"} capitalize tracking-tight`}>
                          {history.stage.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-[10px] text-outline opacity-60">
                          {new Date(history.moved_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {index === 0 && (
                        <span className="text-[10px] text-primary font-medium mt-0.5">Current Status</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Notes Area */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
                Research & Interview Notes
              </h4>
            </div>
            <div className="space-y-3 mb-4">
              {job.notes?.length === 0 ? (
                <p className="text-[10px] text-outline italic text-center py-4 bg-surface-container-low/20 rounded border border-dashed border-outline-variant/20">
                  No notes yet. Add thoughts about company culture or salary expectations.
                </p>
              ) : (
                job.notes?.map(note => (
                  <div key={note.id} className="bg-surface-container-low/50 p-4 rounded-lg border border-outline-variant/10 text-sm shadow-sm">
                    <p className="text-on-surface leading-relaxed">{note.content}</p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant/5">
                      <span className="text-[9px] font-mono text-outline uppercase tracking-wider">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="relative mt-6 group">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full min-h-[100px] bg-surface-container border border-outline-variant/20 rounded-lg focus:border-primary/50 transition-all p-4 text-sm text-on-surface placeholder:text-outline/40 resize-none outline-none shadow-inner"
                placeholder="Type a new note..."
              ></textarea>
              <button 
                onClick={handleAddNote}
                disabled={!noteContent.trim()}
                className="absolute bottom-3 right-3 bg-primary text-on-primary-container px-3 py-1.5 rounded-md hover:bg-primary-container disabled:opacity-30 disabled:hover:bg-primary transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                <Send size={12} />
                Save
              </button>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-surface-container border-t border-outline-variant/20 flex space-x-3">
          {isEditing ? (
            <button 
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 bg-zinc-800 border border-outline-variant/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-md hover:bg-zinc-700 transition-all"
            >
              Cancel
            </button>
          ) : (
            <button 
              onClick={handleDelete}
              className="h-12 w-12 flex items-center justify-center bg-error/10 text-error border border-error/20 rounded-md hover:bg-error hover:text-white transition-all"
              title="Delete Application"
            >
              <Trash2 size={18} />
            </button>
          )}
          
          <button 
            onClick={isEditing ? handleSaveEdit : onClose}
            className="flex-1 py-3 bg-primary text-on-primary-container text-[10px] font-black uppercase tracking-[0.2em] rounded-md shadow-[0_4px_20px_rgba(192,193,255,0.15)] hover:brightness-105 transition-all"
          >
            {isEditing ? "Save All Changes" : "Close Panel"}
          </button>
        </div>
      </section>
    </div>
  );
};
