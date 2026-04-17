import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { JobDetail, JobStage } from '@/types';

export const useJobDetail = (jobId?: number) => {
  const queryClient = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const { data } = await api.get<JobDetail>(`/jobs/${jobId}/`);
      return data;
    },
    enabled: !!jobId,
  });

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!jobId) return;
      const { data } = await api.post(`/jobs/${jobId}/notes/`, { content });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async (updatedData: Partial<JobDetail>) => {
      if (!jobId) return;
      const { data } = await api.put(`/jobs/${jobId}/`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const followupMutation = useMutation({
    mutationFn: async () => {
      if (!jobId) return null;
      const { data } = await api.post(`/ai/followup/${jobId}/`);
      return data.followup;
    },
  });

  return {
    job: jobQuery.data,
    isLoading: jobQuery.isLoading,
    addNote: addNoteMutation.mutateAsync,
    updateJob: updateJobMutation.mutateAsync,
    getFollowup: followupMutation.mutateAsync,
    isGeneratingFollowup: followupMutation.isPending,
  };
};
