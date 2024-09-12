import { create } from "zustand";

interface SkeletonState {
  loadingDurationMs: number;
  initTransitionDuration: string;
  isRealLoading: boolean;
  realLoadingStartTimeMs: number;
  isLoading: boolean;
  duration: string;
  gradient: string;
  timingFunction: string;
  actions: {
    setControls: (state: Partial<Omit<SkeletonState, "actions">>) => void;
  };
}

const useSkeleton = create<SkeletonState>((set) => ({
  loadingDurationMs: 1000,
  initTransitionDuration: "0.2s",
  realLoadingStartTimeMs: 200,
  isRealLoading: false,
  isLoading: false,
  duration: "1.5s",
  gradient: "linear-gradient(90deg, #F7F8F9 0%, #F7F8F950 20%, #F7F8F9 40%)",
  timingFunction: "ease-in-out",
  actions: {
    setControls: set,
  },
}));

export const useSkeletonLoading = () => useSkeleton((state) => state.isLoading);
export const useSkeletonInitTransitionDuration = () =>
  useSkeleton((state) => state.initTransitionDuration);
export const useIsRealLoading = () => useSkeleton((state) => state.isRealLoading);
export const useRealLoadingStartTimeMs = () => useSkeleton((state) => state.realLoadingStartTimeMs);
export const useSkeletonActions = () => useSkeleton((state) => state.actions);
export const useSkeletonDuration = () => useSkeleton((state) => state.duration);
export const useSkeletonGradient = () => useSkeleton((state) => state.gradient);
export const useLoadingDurationMs = () => useSkeleton((state) => state.loadingDurationMs);
export const useSkeletonTimingFunction = () => useSkeleton((state) => state.timingFunction);
