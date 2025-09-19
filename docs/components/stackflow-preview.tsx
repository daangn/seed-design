"use client";

import * as React from "react";

import type { RegisteredActivityName } from "@stackflow/config";
import { Stackflow } from "./stackflow/Stackflow";

interface StackflowPreviewProps {
  names: string[];
}

export function StackflowPreview(props: StackflowPreviewProps) {
  const { names } = props;

  const activities = React.useMemo(() => {
    const Components = names.map((name) => {
      const Component = React.lazy(() => import(`../examples/${name}.tsx`));

      if (!Component) {
        throw new Error(`Component not found: ${name}`);
      }

      return {
        name: name as RegisteredActivityName,
        component: Component,
      };
    });

    return Components;
  }, [names]);

  return (
    <React.Suspense>
      <Stackflow activities={activities} />
    </React.Suspense>
  );
}
