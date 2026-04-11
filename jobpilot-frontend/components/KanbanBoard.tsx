import React, { useState, useEffect } from "react";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  UniqueIdentifier,
  rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
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
  MoreHorizontal
} from "lucide-react";
import { JobApplication, JobStage } from "@/types";
import { useJobs } from "@/hooks/useJobs";

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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (transform) return;
        onClick();
      }}
      className={`group bg-surface-container border ${
        isInterview ? "border-primary/30 shadow-lg shadow-primary/5 bg-surface-container-high" : 
        isOffer ? "border-tertiary/20 shadow-md hover:shadow-tertiary/10 bg-surface-container" :
        isRejected ? "border-outline-variant/10 cursor-not-allowed" :
        "border-outline-variant/15 shadow-sm hover:shadow-black/40 hover:bg-surface-container-high"
      } p-4 rounded-md transition-all cursor-grab active:cursor-grabbing relative overflow-hidden flex flex-col gap-3 ${isOverlay ? 'shadow-2xl ring-2 ring-primary/50 cursor-grabbing' : ''}`}
    >
      {isOffer && (
        <div className="absolute top-0 right-0 p-1">
          <div className="h-12 w-12 bg-tertiary/5 rounded-full blur-xl"></div>
        </div>
      )}
      
      {/* Header: Status Icon & Time */}
      <div className="flex items-center justify-between">
        <div className={`${isInterview ? "text-primary" : "text-zinc-600"} ${!isRejected ? "opacity-0 group-hover:opacity-100" : ""} transition-opacity`}>
          {isInterview ? <Calendar size={14} /> : isRejected ? <Ban size={14} /> : <GripVertical size={14} />}
        </div>
        <span
          className={`font-mono text-[10px] ${
            isInterview ? "text-secondary-fixed-dim bg-secondary-container/20" :
            isOffer ? "text-tertiary bg-tertiary/10" :
            isFollowedUp ? "text-indigo-400 bg-indigo-900/20" :
            "text-zinc-400 bg-zinc-800"
          } px-2 py-0.5 rounded-full`}
        >
          {timeLabel}
        </span>
      </div>

      {/* Main Content: Title & Company */}
      <div>
        <h4 className={`font-bold ${isRejected ? "text-zinc-400" : "text-on-surface"} text-sm leading-snug mb-1.5 line-clamp-2`}>
          {card.title}
        </h4>
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shrink-0 ${isRejected ? "opacity-50" : ""}`}>
            <span className="text-[8px] uppercase">{card.company.slice(0, 2)}</span>
          </div>
          <span className={`text-xs ${isRejected ? "text-zinc-500" : "text-on-surface-variant"} font-medium truncate`}>
            {card.company}
          </span>
        </div>
      </div>

      {/* Details: Location, Source, Job Type */}
      {!isRejected && (card.location || card.source || card.job_type) && (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {card.location && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate max-w-[100px]">{card.location}</span>
            </div>
          )}
          {card.source && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
              <Globe size={12} className="shrink-0" />
              <span className="truncate max-w-[80px]">{card.source}</span>
            </div>
          )}
          {card.job_type && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
              <Briefcase size={12} className="shrink-0" />
              <span className="truncate max-w-[80px]">{card.job_type}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Footer: Package & Actions */}
      {!isRejected ? (
        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3 mt-auto">
          <div className="flex gap-2 text-zinc-500">
            <FileText size={14} className="hover:text-primary transition-colors cursor-pointer" />
            <Sparkles size={14} className={`${isInterview || isOffer ? "text-secondary" : ""} hover:text-secondary transition-colors cursor-pointer`} />
          </div>
          {card.salary_range && (
            <div className="flex items-center gap-1 bg-tertiary/5 px-2 py-0.5 rounded border border-tertiary/10">
              <Banknote size={12} className="text-tertiary font-bold" />
              <span className="font-mono text-[10px] text-tertiary font-bold tracking-tight">{card.salary_range}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-outline-variant/5 pt-3 mt-auto">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">Archive ref: #{card.id}</span>
        </div>
      )}
    </div>
  );
};






const KanbanColumn = ({
  id,
  title,
  cards,
  dotColor,
  grayscale,
  onCardClick,
}: {
  id: JobStage;
  title: string;
  cards: JobApplication[];
  dotColor: string;
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
    <div className={`flex flex-col w-80 shrink-0 ${grayscale ? "grayscale opacity-60" : ""}`}>
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`}></span>
          <h3 className="font-bold text-on-surface tracking-tight text-sm uppercase">
            {title}
          </h3>
          <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
            {cards.length.toString().padStart(2, '0')}
          </span>
        </div>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      <div 
        ref={setNodeRef}
        className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]"
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 pb-20">
            {cards.map((card) => (
              <KanbanCard key={card.id} card={card} onClick={() => onCardClick(card)} />
            ))}
          </div>
        </SortableContext>
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
  const [activeCard, setActiveCard] = useState<JobApplication | null>(null);
  const [localJobs, setLocalJobs] = useState<JobApplication[]>(initialJobs);

  // Keep local jobs in sync with prop updates (except during active dragging)
  useEffect(() => {
    if (!activeCard) {
      // Deep compare or simple length/id check to avoid redundant updates
      const isSame = 
        localJobs.length === initialJobs.length && 
        localJobs.every((job, i) => job.id === initialJobs[i]?.id && job.current_stage === initialJobs[i]?.current_stage);
      
      if (!isSame) {
        setLocalJobs(initialJobs);
      }
    }
  }, [initialJobs, activeCard, localJobs.length]); // Added localJobs.length for safety

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

  const columns: { title: string; stage: JobStage; dotColor: string; grayscale?: boolean }[] = [
    { title: "Applied", stage: "applied", dotColor: "bg-zinc-400" },
    { title: "Followed Up", stage: "followed_up", dotColor: "bg-indigo-400" },
    { title: "Interview", stage: "interview", dotColor: "bg-secondary" },
    { title: "Offer", stage: "offer", dotColor: "bg-tertiary" },
    { title: "Rejected", stage: "rejected", dotColor: "bg-error" },
    { title: "Archived", stage: "archived", dotColor: "bg-zinc-600", grayscale: true },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = active.data.current?.card;
    if (card) setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find active and over containers (stages)
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

    // Moving between containers
    setLocalJobs((prev) => {
      return prev.map((job) => {
        if (job.id === activeId) {
          return { ...job, current_stage: overStage! };
        }
        return job;
      });
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as number;
    
    // Reset active card
    setActiveCard(null);

    if (!over) {
      // If dropped nowhere, localJobs will reset from initialJobs via useEffect
      return;
    }

    // Determine the final stage from localJobs
    const draggedJob = localJobs.find(j => j.id === activeId);
    const originalJob = initialJobs.find(j => j.id === activeId);

    if (draggedJob && originalJob && draggedJob.current_stage !== originalJob.current_stage) {
      // Sync with backend
      await updateStage({ 
        jobId: activeId, 
        newStage: draggedJob.current_stage 
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={rectIntersection} // Rect intersection is more reliable for grid/column layouts
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto p-6 scroll-smooth">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((column) => (
            <KanbanColumn 
              key={column.stage} 
              id={column.stage}
              title={column.title}
              dotColor={column.dotColor}
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
              opacity: '0.5',
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
