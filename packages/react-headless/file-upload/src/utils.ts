export interface SplitFileNameResult {
  basename: string;
  extension: string;
}

/**
 * Split a filename into basename and extension.
 *
 * "document.pdf" -> { basename: "document", extension: ".pdf" }
 * ".gitignore"   -> { basename: ".gitignore", extension: "" }
 * "README"       -> { basename: "README", extension: "" }
 */
export function splitFileName(name: string): SplitFileNameResult {
  if (!name) return { basename: "", extension: "" };

  const lastDot = name.lastIndexOf(".");
  // No dot, or dot is first character (dotfile)
  if (lastDot <= 0) return { basename: name, extension: "" };

  return {
    basename: name.slice(0, lastDot),
    extension: name.slice(lastDot),
  };
}
