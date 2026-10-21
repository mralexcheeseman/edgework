import { useQuery } from '@tanstack/react-query';
import { listDispatches, listEssays, listPositions, listProjects } from '@/lib/content';

const opts = { staleTime: 5 * 60 * 1000 };
export const usePositions = () => useQuery({ queryKey: ['positions'], queryFn: listPositions, ...opts });
export const useEssays = () => useQuery({ queryKey: ['essays'], queryFn: listEssays, ...opts });
export const useDispatches = () => useQuery({ queryKey: ['dispatches'], queryFn: listDispatches, ...opts });
export const useProjects = () => useQuery({ queryKey: ['projects'], queryFn: listProjects, ...opts });
