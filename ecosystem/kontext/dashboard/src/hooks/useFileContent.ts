import { useCallback, useState } from "react";

export interface FileContent {
  content: string;
  path: string;
  size: number;
  extension: string;
}

interface UseFileContentReturn {
  fileContent: FileContent | null;
  loading: boolean;
  error: string | null;
  isBinary: boolean;
  loadFile: (path: string) => Promise<void>;
}

export function useFileContent(): UseFileContentReturn {
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBinary, setIsBinary] = useState(false);

  const loadFile = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    setIsBinary(false);

    try {
      const res = await fetch(`/api/file-content?path=${encodeURIComponent(path)}`);

      if (res.status === 413) {
        setError("File too large (max 512KB)");
        setFileContent(null);
        return;
      }

      if (res.status === 415) {
        setIsBinary(true);
        setError("Binary file — cannot preview");
        setFileContent(null);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to load file" }));
        setError(data.error ?? "Failed to load file");
        setFileContent(null);
        return;
      }

      const data: FileContent = await res.json();
      setFileContent(data);
    } catch {
      setError("Network error");
      setFileContent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fileContent, loading, error, isBinary, loadFile };
}
