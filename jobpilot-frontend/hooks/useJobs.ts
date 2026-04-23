import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { JobApplication, JobStage } from '@/types';

const EMPTY_JOBS: JobApplication[] = [];

export const useJobs = (searchTerm: string = '') => {
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ['jobs', searchTerm],
    queryFn: async () => {
      const url = searchTerm ? `/jobs/?search=${encodeURIComponent(searchTerm)}` : '/jobs/';
      const { data } = await api.get<JobApplication[]>(url);
      return data;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30,    // Keep in cache for 30 minutes
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ jobId, newStage }: { jobId: number; newStage: JobStage }) => {
      const { data } = await api.post(`/jobs/${jobId}/stage/`, { stage: newStage });
      return data;
    },
    // Optimistic Update
    onMutate: async ({ jobId, newStage }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs', searchTerm] });
      const previousJobs = queryClient.getQueryData<JobApplication[]>(['jobs', searchTerm]);

      if (previousJobs) {
        queryClient.setQueryData<JobApplication[]>(['jobs', searchTerm], (old) => 
          old?.map(job => job.id === jobId ? { ...job, current_stage: newStage, updated_at: new Date().toISOString() } : job)
        );
      }
      return { previousJobs };
    },
    onError: (err, variables, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs', searchTerm], context.previousJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', searchTerm] });
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (newJob: Partial<JobApplication>) => {
      const { data } = await api.post<JobApplication>("/jobs/", newJob);
      return data;
    },
    // Optimistic Update for "No Reload" addition
    onMutate: async (newJob) => {
      await queryClient.cancelQueries({ queryKey: ['jobs', searchTerm] });
      const previousJobs = queryClient.getQueryData<JobApplication[]>(['jobs', searchTerm]);

      if (previousJobs) {
        const optimisticJob: JobApplication = {
          id: Math.random(), // Temporary ID
          title: newJob.title || '',
          company: newJob.company || '',
          location: newJob.location || '',
          description: newJob.description || '',
          source: newJob.source || '',
          job_type: newJob.job_type || '',
          salary_range: newJob.salary_range || '',
          current_stage: 'applied',
          applied_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          days_since_applied: 0,
          key_skills: [],
          experience_required: ''
        };
        queryClient.setQueryData<JobApplication[]>(['jobs', searchTerm], [optimisticJob, ...previousJobs]);
      }
      return { previousJobs };
    },
    onError: (err, variables, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs', searchTerm], context.previousJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', searchTerm] });
    },
  });

  const extractJobMutation = useMutation({
    mutationFn: async (description: string) => {
      const { data } = await api.post("/ai/extract/", { description });
      return data;
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      await api.delete(`/jobs/${jobId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  return {
    jobs: jobsQuery.data || EMPTY_JOBS,
    isLoading: jobsQuery.isLoading,
    error: jobsQuery.error,
    updateStage: updateStageMutation.mutateAsync,
    createJob: createJobMutation.mutateAsync,
    extractJob: extractJobMutation.mutateAsync,
    isExtracting: extractJobMutation.isPending,
    deleteJob: deleteJobMutation.mutateAsync,
  };
};
