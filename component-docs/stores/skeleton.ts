import { create } from "zustand";

interface SkeletonState {
  isLoading: boolean;
  duration: string;
  gradient: string;
  actions: {
    toggleLoading: () => void;
    setControls: (state: { duration: string; gradient: string }) => void;
  };
}

const useSkeleton = create<SkeletonState>((set) => ({
  isLoading: true,
  duration: "1.5s",
  gradient: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
  actions: {
    toggleLoading: () => set((state) => ({ isLoading: !state.isLoading })),
    setControls: set,
  },
}));

export const useSkeletonLoading = () => useSkeleton((state) => state.isLoading);
export const useSkeletonActions = () => useSkeleton((state) => state.actions);
export const useSkeletonDuration = () => useSkeleton((state) => state.duration);
export const useSkeletonGradient = () => useSkeleton((state) => state.gradient);
