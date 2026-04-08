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

  return {
    job: jobQuery.data,
    isLoading: jobQuery.isLoading,
    addNote: addNoteMutation.mutateAsync,
  };
};
