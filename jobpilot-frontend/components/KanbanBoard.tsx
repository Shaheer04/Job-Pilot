import React, { useState } from "react";
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
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
        // Prevent click when dragging starts
        if (transform) return;
        onClick();
      }}
      className={`group bg-surface-container border ${
        isInterview ? "border-primary/30 shadow-lg shadow-primary/5 bg-surface-container-high" : 
        isOffer ? "border-tertiary/20 shadow-md hover:shadow-tertiary/10 bg-surface-container" :
        isRejected ? "border-outline-variant/10 cursor-not-allowed" :
        "border-outline-variant/15 shadow-sm hover:shadow-black/40 hover:bg-surface-container-high"
      } p-4 rounded-md transition-all cursor-grab active:cursor-grabbing relative overflow-hidden ${isOverlay ? 'shadow-2xl ring-2 ring-primary/50 cursor-grabbing' : ''}`}
    >
      {isOffer && (
        <div className="absolute top-0 right-0 p-1">
          <div className="h-12 w-12 bg-tertiary/5 rounded-full blur-xl"></div>
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`material-symbols-outlined ${isInterview ? "text-primary" : "text-zinc-600"} ${!isRejected ? "opacity-0 group-hover:opacity-100" : ""} transition-opacity text-sm`}
          data-icon={isInterview ? "calendar_today" : isRejected ? "block" : "drag_indicator"}
        >
          {isInterview ? "calendar_today" : isRejected ? "block" : "drag_indicator"}
        </span>
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
      <h4 className={`font-bold ${isRejected ? "text-zinc-400" : "text-on-surface"} text-sm mb-1`}>
        {card.title}
      </h4>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden ${isRejected ? "opacity-50" : ""}`}>
          <span className="text-[8px] uppercase">{card.company.slice(0, 2)}</span>
        </div>
        <span className={`text-xs ${isRejected ? "text-zinc-500" : "text-on-surface-variant"} font-medium`}>
          {card.company}
        </span>
      </div>
      
      {!isRejected ? (
        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3">
          <div className="flex gap-2">
            <span className="material-symbols-outlined text-zinc-500 text-sm hover:text-primary transition-colors" data-icon="sticky_note_2">
              sticky_note_2
            </span>
            <span className={`material-symbols-outlined text-sm ${isInterview || isOffer ? "text-secondary" : "text-zinc-500"} hover:text-secondary transition-colors`} data-icon={isOffer ? "auto_awesome" : "psychology"}>
              {isOffer ? "auto_awesome" : "psychology"}
            </span>
          </div>
          {card.salary_range && (
            <span className="font-mono text-xs text-tertiary font-bold">{card.salary_range}</span>
          )}
        </div>
      ) : (
        <div className="border-t border-outline-variant/5 pt-3">
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
        <button className="material-symbols-outlined text-zinc-500 hover:text-white text-lg" data-icon="more_horiz">
          more_horiz
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <SortableContext id={id} items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 min-h-[200px]">
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const jobId = active.id as number;
    const overId = over.id as string;

    // Check if we dropped onto a column or an item in a column
    let newStage: JobStage | undefined;
    
    // Column IDs are the stages
    if (columns.some(col => col.stage === overId)) {
      newStage = overId as JobStage;
    } else {
      // Find the stage of the card we dropped over
      const overCard = initialJobs.find(j => j.id === over.id);
      if (overCard) {
        newStage = overCard.current_stage;
      }
    }

    if (newStage) {
      const activeCard = initialJobs.find(j => j.id === jobId);
      if (activeCard && activeCard.current_stage !== newStage) {
        await updateStage({ jobId, newStage });
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
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
              cards={initialJobs.filter(job => job.current_stage === column.stage)} 
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
