import * as React from "react";

import type { ComponentMetadata } from "@/schemas/component";

interface SnippetProps {
  component: string;
}

export function Snippet({ children, component }: React.PropsWithChildren<SnippetProps>) {
  const [metadata, setMetadata] = React.useState<ComponentMetadata>({});

  React.useEffect(() => {
    (async () => {
      const result = await fetch(`/registry/components/${component}.json`, {
        method: "GET",
      });

      const json = await result.json();
      setMetadata(json);
    })();
  }, [component]);

  return (
    <div style={{ border: "1px solid black", padding: "1rem", whiteSpace: "pre-line" }}>
      {JSON.stringify(metadata, null, 2)}
    </div>
  );
}
