import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { HealthScore } from '@/types';

export const useHealthScore = () => {
  return useQuery({
    queryKey: ['health-score'],
    queryFn: async () => {
      const { data } = await api.get<HealthScore>('/ai/health-score/');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
