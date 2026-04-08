export type JobStage = 'applied' | 'followed_up' | 'interview' | 'offer' | 'rejected' | 'archived';

export interface JobApplication {
  id: number;
  title: string;
  company: string;
  location?: string;
  description?: string;
  source?: string;
  job_type?: string;
  salary_range?: string;
  current_stage: JobStage;
  applied_date: string;
  days_since_applied: number;
  created_at: string;
  updated_at: string;
}

export interface StageHistory {
  id: number;
  stage: JobStage;
  moved_at: string;
}

export interface Note {
  id: number;
  content: string;
  created_at: string;
}

export interface AIAdvice {
  summary: string;
  whats_working: string;
  main_problem: string;
  top_3_actions: string[];
}

export interface HealthScore {
  stats: {
    total_applications: number;
    stage_counts: Record<JobStage, number>;
    interview_rate: number;
    best_source: string;
    stale_count: number;
    weekly_momentum: number;
    rating: 'Healthy' | 'Needs Attention' | 'Critical';
  };
  advice: AIAdvice;
}
