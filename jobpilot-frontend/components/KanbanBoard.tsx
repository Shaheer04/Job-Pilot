"use client";

import React, { useState, useEffect } from "react";
import { 
  DndContext, 
  DragOverlay, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  closestCorners,
} from "@dnd-kit/core";
import { 
  sortableKeyboardCoordinates, 
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { 
  MapPin, 
  Globe, 
  Briefcase, 
  Banknote, 
  Calendar, 
  GripVertical, 
  Ban, 
  FileText, 
  Sparkles,
  MoreHorizontal,
  Zap,
  Clock
} from "lucide-react";
import { JobApplication, JobStage } from "@/types";
import { useJobs } from "@/hooks/useJobs";
import { useUIStore } from "@/store/uiStore";

interface KanbanCardProps {
  card: JobApplication;
  onClick: () => void;
  isOverlay?: boolean;
}

const KanbanCard = ({ card, onClick, isOverlay }: KanbanCardProps) => {
  const isInterview = card.current_stage === 'interview';
  const isOffer = card.current_stage === 'offer';
  const isRejected = card.current_stage === 'rejected' || card.current_stage === 'archived';
  const isFollowedUp = card.current_stage === 'followed_up';

  const timeLabel = card.days_since_applied === 0 ? "Today" : `${card.days_since_applied}d ago`;
  const daysInStage = Math.floor((new Date().getTime() - new Date(card.updated_at).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={(e) => {
        onClick();
      }}
      className={`group bg-surface-container-low border ${
        isInterview ? "border-primary/40 shadow-xl shadow-primary/5 bg-surface-container" : 
        isOffer ? "border-tertiary/30 shadow-lg bg-surface-container-high" :
        isRejected ? "border-outline-variant/10 opacity-70" :
        "border-outline-variant/20 hover:border-outline-variant/40 shadow-md hover:bg-surface-container"
      } p-5 rounded-xl transition-all cursor-grab active:cursor-grabbing relative overflow-hidden flex flex-col gap-4 ${isOverlay ? 'shadow-2xl ring-2 ring-primary/50 cursor-grabbing scale-105' : ''}`}
    >
      {/* Visual Accent */}
      <div className={`absolute top-0 left-0 w-1 h-full ${
        isInterview ? "bg-primary" : isOffer ? "bg-tertiary" : isFollowedUp ? "bg-indigo-500" : "bg-zinc-700"
      }`}></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
           <div className={`w-6 h-6 rounded-lg bg-surface flex items-center justify-center text-[10px] font-black text-white border border-outline-variant/20 shadow-inner`}>
            {(card.company || "?").slice(0, 1).toUpperCase()}
          </div>
          <span className={`text-xs font-bold ${isRejected ? "text-zinc-500" : "text-white"} tracking-tight truncate max-w-[140px]`}>
            {card.company || "Unknown Company"}
          </span>
        </div>
        <span className={`font-mono text-[9px] font-bold tracking-widest uppercase ${
            isInterview ? "text-primary bg-primary/10" :
            isOffer ? "text-tertiary bg-tertiary/10" :
            isFollowedUp ? "text-indigo-400 bg-indigo-900/30" :
            "text-zinc-400 bg-zinc-800"
          } px-2 py-1 rounded-md`}>
          {timeLabel}
        </span>
      </div>

      {/* Title */}
      <h4 className={`font-extrabold ${isRejected ? "text-zinc-500 line-through decoration-zinc-700" : "text-on-surface"} text-base leading-tight tracking-tight line-clamp-2`}>
        {card.title}
      </h4>

      {/* Metadata Grid */}
      {!isRejected && (
        <div className="grid grid-cols-1 gap-2">
          {card.location && (
            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-medium">
              <MapPin size={12} className="text-outline" />
              <span>{card.location}</span>
            </div>
          )}
          {card.experience_required && (
            <div className="flex items-center gap-2 text-[10px] text-secondary font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-secondary/70" />
              <span>{card.experience_required}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-medium">
            <Globe size={12} className="text-outline" />
            <span>{card.source || "Unknown Source"}</span>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4 mt-1">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-outline" />
          <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
            {daysInStage}d <span className="font-normal opacity-60">in stage</span>
          </span>
        </div>
        {card.salary_range && (
          <div className="flex items-center gap-1.5 bg-tertiary/5 px-2.5 py-1 rounded-md border border-tertiary/10">
            <Banknote size={12} className="text-tertiary" />
            <span className="font-mono text-[10px] text-tertiary font-black">{card.salary_range}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DraggableCard = ({ card, onCardClick }: { card: JobApplication, onCardClick: (job: JobApplication) => void }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useSortable({
        id: card.id,
        data: {
          type: 'card',
          card,
        },
    });

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} className={isDragging ? "opacity-0" : ""}>
            <KanbanCard card={card} onClick={() => onCardClick(card)} />
        </div>
    );
};

import { useSortable } from "@dnd-kit/sortable";

const KanbanColumn = ({
  id,
  title,
  cards,
  dotColor,
  bgColor,
  grayscale,
  onCardClick,
}: {
  id: JobStage;
  title: string;
  cards: JobApplication[];
  dotColor: string;
  bgColor: string;
  grayscale?: boolean;
  onCardClick: (job: JobApplication) => void;
}) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'column',
      stage: id,
    },
  });

  return (
    <div className={`flex flex-col w-80 shrink-0 ${grayscale ? "opacity-60" : ""}`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-5 px-3">
        <div className="flex items-center gap-3">
          <div className={`h-2.5 w-2.5 rounded-full ${dotColor} shadow-[0_0_8px_rgba(255,255,255,0.1)]`}></div>
          <h3 className="font-black text-white tracking-[0.1em] text-[11px] uppercase">
            {title}
          </h3>
          <div className="font-mono text-[10px] font-bold text-outline bg-surface-container-high/50 px-2 py-0.5 rounded-md border border-outline-variant/10">
            {cards.length}
          </div>
        </div>
        <button className="text-zinc-600 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      {/* Column Content Area */}
      <div 
      ref={setNodeRef}
      className={`rounded-2xl p-3 border border-outline-variant/5 ${bgColor} transition-colors duration-300 min-h-[400px] h-fit flex flex-col`}
      >
      <div className="flex flex-col gap-4 pb-4">
          {cards.map((card) => (
            <DraggableCard key={card.id} card={card} onCardClick={onCardClick} />
          ))}
      </div>

      {/* Column-specific Empty State */}
      {cards.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-outline-variant/5 rounded-xl opacity-40 group-hover:opacity-100 transition-opacity">
          {id === 'applied' ? (
            <div className="flex flex-col items-center text-center">
              <Zap size={20} className="text-indigo-400 mb-2" />
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Start Clipping</p>
              <p className="text-[9px] text-zinc-500 mt-1">Use the extension to add jobs instantly</p>
            </div>
          ) : id === 'interview' ? (
            <div className="flex flex-col items-center text-center">
              <Sparkles size={20} className="text-primary mb-2" />
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Awaiting Stage</p>
              <p className="text-[9px] text-zinc-500 mt-1">Move jobs here once scheduled</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className={`h-1.5 w-1.5 rounded-full ${dotColor} mb-2`}></div>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Empty Stage</p>
            </div>
          )}
        </div>
      )}
      </div>
      </div>
      );
      };

      export const KanbanBoard = ({ 
      jobs: initialJobs, 
      onCardClick 
      }: { 
      jobs: JobApplication[]; 
      onCardClick: (job: JobApplication) => void 
      }) => {
      const { updateStage } = useJobs();
      const { openAddJobModal } = useUIStore();
      const [activeCard, setActiveCard] = useState<JobApplication | null>(null);
      const [localJobs, setLocalJobs] = useState<JobApplication[]>(initialJobs);

      useEffect(() => {
      if (!activeCard) {
      const isSame = 
      localJobs.length === initialJobs.length && 
      localJobs.every((job, i) => job.id === initialJobs[i]?.id && job.current_stage === initialJobs[i]?.current_stage);

      if (!isSame) {
      setLocalJobs(initialJobs);
      }
      }
      }, [initialJobs, activeCard, localJobs.length]);

      const sensors = useSensors(
      useSensor(PointerSensor, {
      activationConstraint: {
      distance: 8,
      },
      }),
      useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      })
      );

      const columns: { title: string; stage: JobStage; dotColor: string; bgColor: string; grayscale?: boolean }[] = [
      { title: "Applied", stage: "applied", dotColor: "bg-zinc-400", bgColor: "bg-zinc-500/[0.02]" },
      { title: "Assessment", stage: "assessment", dotColor: "bg-amber-500", bgColor: "bg-amber-500/[0.03]" },
      { title: "Followed Up", stage: "followed_up", dotColor: "bg-indigo-500", bgColor: "bg-indigo-500/[0.03]" },
      { title: "Interview", stage: "interview", dotColor: "bg-primary", bgColor: "bg-primary/[0.03]" },
      { title: "Offer", stage: "offer", dotColor: "bg-tertiary", bgColor: "bg-tertiary/[0.03]" },
      { title: "Rejected", stage: "rejected", dotColor: "bg-error", bgColor: "bg-error/[0.02]" },
      { title: "Archived", stage: "archived", dotColor: "bg-zinc-700", bgColor: "bg-zinc-800/[0.02]", grayscale: true },
      ];

      const handleDragStart = (event: DragStartEvent) => {
      const { active } = event;
      const card = active.data.current?.card;
      if (card) setActiveCard(card);
      };

      const handleDragOver = (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      const activeStage = activeData?.card?.current_stage;
      let overStage: JobStage | undefined;

      if (overData?.type === 'column') {
      overStage = overData.stage;
      } else if (overData?.type === 'card') {
      overStage = overData.card.current_stage;
      }

      if (!overStage || activeStage === overStage) return;

      setLocalJobs((prev) => {
      return prev.map((job) => {
      if (job.id === active.id) {
        return { ...job, current_stage: overStage! };
      }
      return job;
      });
      });
      };

      const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;
      const activeId = active.id as number;

      setActiveCard(null);

      if (!over) return;

      const draggedJob = localJobs.find(j => j.id === activeId);
      const originalJob = initialJobs.find(j => j.id === activeId);

      if (draggedJob && originalJob && draggedJob.current_stage !== originalJob.current_stage) {
      await updateStage({ 
      jobId: activeId, 
      newStage: draggedJob.current_stage 
      });
      }
      };

      if (initialJobs.length === 0) {
      return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
          <div className="relative bg-surface-container-high border border-outline-variant/20 p-8 rounded-3xl shadow-2xl">
            <Briefcase size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Your Board is Ready</h2>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              You haven't tracked any jobs yet. Start building your pipeline and let AI help you land your next role.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={openAddJobModal}
            className="w-full py-4 bg-primary text-indigo-900 text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Zap size={16} />
            Add Your First Job
          </button>
          <p className="text-[10px] text-outline font-bold uppercase tracking-widest">
            Or use our Chrome extension to clip from LinkedIn
          </p>
        </div>
      </div>
      </div>
      );
      }

      return (
      <DndContext 
 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto p-8 scroll-smooth h-full">
        <div className="flex gap-8 h-full min-w-max">
          {columns.map((column) => (
            <KanbanColumn 
              key={column.stage} 
              id={column.stage}
              title={column.title}
              dotColor={column.dotColor}
              bgColor={column.bgColor}
              grayscale={column.grayscale}
              cards={localJobs.filter(job => job.current_stage === column.stage)} 
              onCardClick={onCardClick} 
            />
          ))}
        </div>
      </div>
      
      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.4',
            },
          },
        }),
      }}>
        {activeCard ? (
          <KanbanCard 
            card={activeCard} 
            onClick={() => {}} 
            isOverlay 
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
