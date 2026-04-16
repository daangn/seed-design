import { useCallback, useEffect, useState } from "react";
import type { KontextGraph } from "@/types";

export function useGraph() {
  const [graph, setGraph] = useState<KontextGraph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGraph = useCallback(() => {
    setLoading(true);
    fetch("/api/graph")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setGraph(data as KontextGraph);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const rebuild = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rebuild", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGraph(data as KontextGraph);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rebuild failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { graph, error, loading, rebuild, refetch: fetchGraph };
}
