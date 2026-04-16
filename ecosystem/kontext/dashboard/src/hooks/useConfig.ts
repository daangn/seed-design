import { useCallback, useState } from "react";
import type { KontextConfig } from "@/types";

export function useConfig() {
  const [config, setConfig] = useState<KontextConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<string | null>(null);

  const loadConfig = useCallback(async (packageDir: string) => {
    setCurrentPackage(packageDir);
    try {
      const res = await fetch(`/api/config/${encodeURIComponent(packageDir)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as KontextConfig;
      setConfig(data);
    } catch {
      setConfig({ content: "", exists: false });
    }
  }, []);

  const saveConfig = useCallback(async (packageDir: string, content: string): Promise<boolean> => {
    setSaving(true);
    try {
      const res = await fetch(`/api/config/${encodeURIComponent(packageDir)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setConfig({ content, exists: true });
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { config, saving, currentPackage, loadConfig, saveConfig };
}
