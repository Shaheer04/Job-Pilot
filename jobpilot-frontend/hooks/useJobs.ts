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
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ jobId, newStage }: { jobId: number; newStage: JobStage }) => {
      const { data } = await api.post(`/jobs/${jobId}/stage/`, { stage: newStage });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (newJob: Partial<JobApplication>) => {
      const { data } = await api.post<JobApplication>("/jobs/", newJob);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const extractJobMutation = useMutation({
    mutationFn: async (description: string) => {
      const { data } = await api.post("/ai/extract/", { description });
      return data;
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
  };
};
