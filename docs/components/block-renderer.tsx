import * as React from "react";

// block 이름으로 고르므로 번들러가 미리 알 수 있게 후보를 glob으로 등록하고, 실제 import는 지연한다.
const blocks = import.meta.glob<{ default: React.ComponentType }>("../registry/react/block/*.tsx");

export function BlockRenderer({ name }: { name: string }) {
  const Block = React.useMemo(() => {
    const load = blocks[`../registry/react/block/${name}.tsx`];
    return load ? React.lazy(load) : undefined;
  }, [name]);

  if (!Block) return null;

  return (
    <React.Suspense fallback={null}>
      <Block />
    </React.Suspense>
  );
}
