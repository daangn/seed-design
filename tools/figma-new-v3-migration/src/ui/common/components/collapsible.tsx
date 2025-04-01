import { type ReactNode, createContext, useContext, useState } from "react";

// 단일 Collapsible 컨텍스트
interface CollapsibleContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

// 여러 Collapsible 관리 컨텍스트
interface CollapsibleGroupContextValue {
  openItems: Record<string, boolean>;
  toggleItem: (id: string) => void;
  toggleAll: (value?: boolean) => void;
  isAllOpen: boolean;
  isAllClosed: boolean;
}

const CollapsibleGroupContext = createContext<CollapsibleGroupContextValue | null>(null);

// Collapsible 컴포넌트
interface CollapsibleProps {
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

function Collapsible({
  children,
  defaultOpen = false,
  id,
  isOpen: controlledIsOpen,
  onOpenChange,
}: CollapsibleProps) {
  const group = useContext(CollapsibleGroupContext);
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);

  // 컨트롤 모드 결정 (그룹 내부, 외부 제어, 비제어)
  const isControlled = controlledIsOpen !== undefined;
  const isInGroup = group !== null && id !== undefined;

  const isOpen = isInGroup
    ? (group.openItems[id] ?? defaultOpen)
    : isControlled
      ? controlledIsOpen
      : uncontrolledIsOpen;

  const toggle = () => {
    if (isInGroup && id) {
      group.toggleItem(id);
    } else if (isControlled && onOpenChange) {
      onOpenChange(!controlledIsOpen);
    } else {
      setUncontrolledIsOpen(!uncontrolledIsOpen);
    }
  };

  return (
    <CollapsibleContext.Provider value={{ isOpen, toggle }}>{children}</CollapsibleContext.Provider>
  );
}

// Collapsible 트리거 컴포넌트
interface CollapsibleTriggerProps {
  children: ReactNode | ((props: { isOpen: boolean; toggle: () => void }) => ReactNode);
  asChild?: boolean;
}

function CollapsibleTrigger({ children, asChild = false }: CollapsibleTriggerProps) {
  const context = useContext(CollapsibleContext);

  if (!context) {
    throw new Error("CollapsibleTrigger must be used within a Collapsible");
  }

  const { isOpen, toggle } = context;

  if (asChild) {
    return children as JSX.Element;
  }

  if (typeof children === "function") {
    return (
      <div onClick={toggle} style={{ cursor: "pointer" }}>
        {children({ isOpen, toggle })}
      </div>
    );
  }

  return (
    <div onClick={toggle} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
}

// Collapsible 콘텐츠 컴포넌트
interface CollapsibleContentProps {
  children: ReactNode;
}

function CollapsibleContent({ children }: CollapsibleContentProps) {
  const context = useContext(CollapsibleContext);

  if (!context) {
    throw new Error("CollapsibleContent must be used within a Collapsible");
  }

  const { isOpen } = context;

  if (!isOpen) {
    return null;
  }

  return <>{children}</>;
}

// CollapsibleGroup 컴포넌트
interface CollapsibleGroupProps {
  children: ReactNode;
  defaultOpenItems?: string[];
}

function CollapsibleGroup({ children, defaultOpenItems = [] }: CollapsibleGroupProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    defaultOpenItems.forEach((id) => {
      initialState[id] = true;
    });
    return initialState;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = (value?: boolean) => {
    if (value !== undefined) {
      const newState = { ...openItems };
      Object.keys(newState).forEach((key) => {
        newState[key] = value;
      });
      setOpenItems(newState);
    } else {
      // 모든 항목이 열려있으면 모두 닫고, 아니면 모두 엶
      const allOpen = Object.values(openItems).every(Boolean);
      const newState = { ...openItems };
      Object.keys(newState).forEach((key) => {
        newState[key] = !allOpen;
      });
      setOpenItems(newState);
    }
  };

  // 모든 항목이 열려있는지 여부
  const isAllOpen = Object.keys(openItems).length > 0 && Object.values(openItems).every(Boolean);
  // 모든 항목이 닫혀있는지 여부
  const isAllClosed =
    Object.keys(openItems).length > 0 && Object.values(openItems).every((v) => !v);

  return (
    <CollapsibleGroupContext.Provider
      value={{
        openItems,
        toggleItem,
        toggleAll,
        isAllOpen,
        isAllClosed,
      }}
    >
      {children}
    </CollapsibleGroupContext.Provider>
  );
}

// CollapsibleGroup.ToggleAll 컴포넌트
interface CollapsibleGroupToggleAllProps {
  children: ReactNode | ((props: { isAllOpen: boolean; toggleAll: () => void }) => ReactNode);
}

function CollapsibleGroupToggleAll({ children }: CollapsibleGroupToggleAllProps) {
  const group = useContext(CollapsibleGroupContext);

  if (!group) {
    throw new Error("CollapsibleGroupToggleAll must be used within a CollapsibleGroup");
  }

  const { toggleAll, isAllOpen } = group;

  if (typeof children === "function") {
    return (
      <div onClick={() => toggleAll()} style={{ cursor: "pointer" }}>
        {children({ isAllOpen, toggleAll })}
      </div>
    );
  }

  return (
    <div onClick={() => toggleAll()} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
}

// 컴포넌트 조합
Collapsible.Trigger = CollapsibleTrigger;
Collapsible.Content = CollapsibleContent;
CollapsibleGroup.ToggleAll = CollapsibleGroupToggleAll;

export { Collapsible, CollapsibleGroup };
