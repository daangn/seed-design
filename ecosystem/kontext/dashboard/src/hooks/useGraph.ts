import { useEffect, useState } from "react";
import type { KontextGraph } from "../types.js";

export function useGraph() {
  const [graph, setGraph] = useState<KontextGraph | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/graph")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setGraph(data as KontextGraph))
      .catch((err) => setError(err.message));
  }, []);

  return { graph, error };
}
