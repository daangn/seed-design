import type React from "react";

import { clsx } from "cn";
import { usePreference } from "../hooks/usePreference";
import * as styles from "./ComponentShowcase.css";

interface ComponentShowcaseProps {
  gridColumns?: number;

  children: React.ReactNode;
}

export function ComponentShowcase(props: ComponentShowcaseProps) {
  const { preferences } = usePreference();
  const { showGrid } = preferences;
  const { gridColumns = 1, children } = props;

  return (
    <div
      className={clsx(styles.root, showGrid && styles.grid)}
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
}
