"use client";

import React from "react";
import { 
  X, 
  Sparkles, 
  Mail, 
  Copy, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Calendar,
  User
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";

interface FollowUpData {
  should_follow_up: boolean;
  recommended_wait_days: number;
  reasoning: string;
  recipient: string;
  subject_line: string;
  email_body: string;
  days_since_applied: number;
  error?: string;
}

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FollowUpData | null;
  isLoading: boolean;
}

export const FollowUpModal = ({ isOpen, onClose, data, isLoading }: FollowUpModalProps) => {
  const { showToast } = useUIStore();

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} copied to clipboard!`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-[#131315] border border-outline-variant/20 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight uppercase">AI Follow-up Coach</h3>
              <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Personalized Outreach Strategy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-white uppercase tracking-widest animate-pulse">Analyzing Job Context...</p>
            </div>
          ) : data?.error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle size={48} className="text-error mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Analysis Failed</h4>
              <p className="text-on-surface-variant text-sm max-w-sm">{data.error}</p>
              <button 
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-surface-container-high border border-outline-variant/20 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-surface-bright transition-all"
              >
                Close Coach
              </button>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Verdict Section */}
              <div className={`p-6 rounded-2xl border ${data.should_follow_up ? 'bg-green-500/5 border-green-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${data.should_follow_up ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                    {data.should_follow_up ? (
                      <CheckCircle2 size={24} className="text-green-400" />
                    ) : (
                      <Clock size={24} className="text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-lg font-black uppercase tracking-tight mb-1 ${data.should_follow_up ? 'text-green-400' : 'text-amber-400'}`}>
                      {data.should_follow_up ? 'Ready to Follow Up' : 'Wait a Little Longer'}
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {data.reasoning}
                    </p>
                  </div>
                </div>

                {!data.should_follow_up && data.recommended_wait_days > 0 && (
                  <div className="mt-4 flex items-center gap-2 bg-zinc-950/50 p-3 rounded-lg border border-amber-500/10 w-fit">
                    <Calendar size={14} className="text-amber-400" />
                    <span className="text-xs font-bold text-white">Recommended Wait: <span className="text-amber-400">{data.recommended_wait_days} more days</span></span>
                  </div>
                )}
              </div>

              {/* Email Content Section */}
              {data.should_follow_up && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-outline">
                    <Mail size={14} className="text-primary" />
                    Generated Outreach Draft
                  </div>

                  {/* Recipient info */}
                  <div className="flex items-center gap-4 text-xs font-bold text-white bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                    <div className="flex items-center gap-2 border-r border-outline-variant/20 pr-4">
                      <User size={14} className="text-primary" />
                      <span className="text-outline uppercase text-[10px]">To:</span>
                      <span className="capitalize">{data.recipient}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-outline uppercase text-[10px]">Subject:</span>
                        <span>{data.subject_line}</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(data.subject_line, 'Subject')}
                        className="text-primary hover:text-white transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Body info */}
                  <div className="relative group">
                    <div className="absolute top-4 right-4 z-10">
                      <button 
                        onClick={() => copyToClipboard(data.email_body, 'Email body')}
                        className="bg-primary/10 hover:bg-primary text-primary hover:text-indigo-900 p-2 rounded-lg transition-all border border-primary/20"
                        title="Copy Body"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <div className="bg-zinc-950 border border-outline-variant/20 rounded-2xl p-8 text-sm leading-relaxed text-on-surface-variant font-medium whitespace-pre-wrap shadow-inner">
                      {data.email_body}
                    </div>
                  </div>

                  <p className="text-[10px] text-outline italic text-center px-8">
                    Tip: Personalize the draft with a specific detail from your recent research or conversation to make it stand out.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-container-low/50 border-t border-outline-variant/10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-primary text-indigo-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg hover:brightness-110 transition-all"
          >
            Got it, Thanks
          </button>
        </div>
      </div>
    </div>
  );
};
