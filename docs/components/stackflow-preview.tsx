"use client";

import * as React from "react";

import type { RegisteredActivityName } from "@stackflow/config";
import { Stackflow } from "./stackflow/Stackflow";
import { getExampleComponent } from "./example-registry";

interface StackflowPreviewProps {
  names: string[];
}

export function StackflowPreview(props: StackflowPreviewProps) {
  const { names } = props;

  const activities = React.useMemo(() => {
    return names.map((name) => {
      const factory = getExampleComponent(name);
      if (!factory) {
        throw new Error(`Component not found: ${name}`);
      }
      const Component = React.lazy(factory);

      return {
        name: name as RegisteredActivityName,
        component: Component,
      };
    });
  }, [names]);

  return (
    <React.Suspense>
      <Stackflow activities={activities} />
    </React.Suspense>
  );
}
