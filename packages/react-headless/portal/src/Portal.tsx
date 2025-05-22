"use client";

import {
  Children,
  type PropsWithChildren,
  type RefObject,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  disabled?: boolean;

  container?: RefObject<HTMLElement | null>;
}

export const Portal = (props: PropsWithChildren<PortalProps>) => {
  const { children, disabled } = props;
  const [container, setContainer] = useState(props.container?.current);
  const isServer = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );

  useEffect(() => {
    setContainer(() => props.container?.current);
  }, [props.container]);

  if (isServer || disabled) return <>{children}</>;

  const mountNode = container ?? (!isServer && globalThis?.document?.body);
  return mountNode ? (
    <>{Children.map(children, (child) => createPortal(child, mountNode))}</>
  ) : null;
};

const subscribe = () => () => {};
