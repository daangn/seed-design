import { create } from "zustand";

interface SkeletonState {
  isLoading: boolean;
  actions: {
    toggleLoading: () => void;
  };
}

const useSkeleton = create<SkeletonState>((set) => ({
  isLoading: true,
  actions: {
    toggleLoading: () => set((state) => ({ isLoading: !state.isLoading })),
  },
}));

export const useSkeletonLoading = () => useSkeleton((state) => state.isLoading);
export const useSkeletonActions = () => useSkeleton((state) => state.actions);
