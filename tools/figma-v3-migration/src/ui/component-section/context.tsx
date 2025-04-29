import { useMigration } from "common/context/migration";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { events } from "shared/event";
import type { InstanceInfo, SwapResult } from "shared/types";

interface ComponentSectionContextType {
  oldComponents: InstanceInfo[];
  requestSuggestions: () => void;
  swapComponent: (instanceNode: InstanceInfo, selectedVariants: Record<string, string>) => void;
  swapAllComponents: (
    instanceNodes: InstanceInfo[],
    selectedVariants: Record<string, string>,
  ) => void;
  swapResults: SwapResult;
  selectedVariants: Record<string, string>;
  handleVariantSelect: (componentId: string, oldVariant: string, newVariant: string) => void;
  newComponents: InstanceInfo[];
  selectedComponent: InstanceInfo | null;
  focusComponent: (component: InstanceInfo) => void;
  migrationTargets: InstanceInfo[];
}

export const ComponentSectionContext = createContext<ComponentSectionContextType | null>(null);

export const ComponentSectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { targets, setLoading } = useMigration();
  const [oldComponents, setOldComponents] = useState<InstanceInfo[]>([]);
  const [newComponents, setNewComponents] = useState<InstanceInfo[]>([]);
  const [swapResults, setSwapResults] = useState<SwapResult>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedComponent, setSelectedComponent] = useState<InstanceInfo | null>(null);

  const reset = useCallback(() => {
    setOldComponents([]);
    setNewComponents([]);
    setSwapResults({});
    setSelectedComponent(null);
    setSelectedVariants({});
  }, []);

  // 컴포넌트 제안 요청
  const requestSuggestions = useCallback(() => {
    reset();
    setLoading(true);
    events("request-component-suggestions").emit({
      nodeIds: targets.map(({ id }) => id),
    });
  }, [targets, setLoading, reset]);

  const handleVariantSelect = (componentId: string, oldVariant: string, newVariant: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [`${componentId}:${oldVariant}`]: newVariant,
    }));
  };

  const swapComponent = useCallback(
    (instanceNode: InstanceInfo, selectedVariants: Record<string, string>) => {
      events("swap-component").emit({
        instanceNode,
        selectedVariants,
      });
    },
    [],
  );

  const swapAllComponents = useCallback(
    (instanceNodes: InstanceInfo[], selectedVariants: Record<string, string>) => {
      events("swap-all-components").emit({
        instanceNodes,
        selectedVariants,
      });
    },
    [],
  );

  const migrationTargets = useMemo(() => {
    return oldComponents.filter((component) => {
      const swapResult = swapResults[component.id];
      return !swapResult?.ok;
    });
  }, [oldComponents, swapResults]);

  const focusComponent = (component: InstanceInfo) => {
    setSelectedComponent(component);
    events("focus-node").emit({ nodeIds: [component.id] });
  };

  // 이벤트 구독
  useEffect(() => {
    const unsubscribe = events("suggest-components").on((payload) => {
      reset();
      setLoading(false);
      const oldComponents = payload.results.filter(({ version }) => version === "v2");
      const newComponents = payload.results.filter(({ version }) => version === "v3");
      setOldComponents(oldComponents);
      setNewComponents(newComponents);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = events("swap-result").on((payload) => {
      setSwapResults(payload.results);
    });

    return unsubscribe;
  }, []);

  return (
    <ComponentSectionContext.Provider
      value={{
        oldComponents,
        requestSuggestions,
        swapComponent,
        swapAllComponents,
        swapResults,
        selectedVariants,
        handleVariantSelect,
        newComponents,
        selectedComponent,
        focusComponent,
        migrationTargets,
      }}
    >
      {children}
    </ComponentSectionContext.Provider>
  );
};

export const useComponentSection = () => {
  const context = useContext(ComponentSectionContext);
  if (!context) {
    throw new Error("useComponentSection must be used within a ComponentSectionProvider");
  }
  return context;
};
