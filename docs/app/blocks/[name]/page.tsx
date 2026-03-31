import { registryBlock } from "../../../registry/react/registry-block";
import { BlockRenderer } from "./block-renderer";

export default async function BlockPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  return <BlockRenderer name={name} />;
}

export function generateStaticParams() {
  const params = registryBlock.items.map((item) => ({ name: item.id }));

  // output: export requires at least one param for dynamic routes
  if (params.length === 0) {
    return [{ name: "__placeholder__" }];
  }

  return params;
}
