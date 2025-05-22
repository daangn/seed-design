"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import { forwardRef, useEffect, useId, useRef } from "react";
import { useSnackbar, type UseSnackbarProps } from "./useSnackbar";
import { SnackbarProvider, useSnackbarContext } from "./useSnackbarContext";
import { composeRefs } from "@radix-ui/react-compose-refs";

export interface SnackbarRootProviderProps extends UseSnackbarProps {
  children: React.ReactNode;
}

export const SnackbarRootProvider = ({
  children,
  pauseOnInteraction,
}: SnackbarRootProviderProps) => {
  const api = useSnackbar({ pauseOnInteraction });
  return <SnackbarProvider value={api}>{children}</SnackbarProvider>;
};

export interface SnackbarRegionProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const SnackbarRegion = forwardRef<HTMLDivElement, SnackbarRegionProps>((props, ref) => {
  const api = useSnackbarContext();
  return (
    <Primitive.div
      ref={composeRefs(api.refs.regionRef, ref)}
      {...mergeProps(api.regionProps, props)}
    />
  );
});
SnackbarRegion.displayName = "SnackbarRegion";

export interface SnackbarRendererProps {}

export const SnackbarRenderer = (_props: SnackbarRendererProps) => {
  const api = useSnackbarContext();
  return api.currentSnackbar?.render();
};

export interface SnackbarRootProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const SnackbarRoot = forwardRef<HTMLDivElement, SnackbarRootProps>((props, ref) => {
  const api = useSnackbarContext();
  return <Primitive.div ref={ref} {...mergeProps(api.rootProps, props)} />;
});

export interface SnackbarCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SnackbarCloseButton = forwardRef<HTMLButtonElement, SnackbarCloseButtonProps>(
  (props, ref) => {
    const { closeButtonProps } = useSnackbarContext();
    return <Primitive.button ref={ref} {...mergeProps(closeButtonProps, props)} />;
  },
);

export interface SnackbarAvoidOverlapProps {
  children: React.ReactElement;
}

export const SnackbarAvoidOverlap = (props: SnackbarAvoidOverlapProps) => {
  const { children } = props;
  const { overlapTracker } = useSnackbarContext();
  const id = useId();
  const childRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      overlapTracker.upsert(id, entries[0].target);
    });
    if (childRef.current) {
      overlapTracker.upsert(id, childRef.current);
      observer.observe(childRef.current, { box: "border-box" });
    }
    return () => {
      overlapTracker.remove(id);
      observer.disconnect();
    };
  }, [overlapTracker, id]);

  return React.cloneElement(children, { ref: childRef });
};
