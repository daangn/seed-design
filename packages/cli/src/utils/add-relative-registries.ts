import type { RegistryLibMachineGenerated, RegistryUIMachineGenerated } from "@/src/schema";

interface AddRelativeComponentsProps {
  userSelects: string[];
  uiRegistryIndex: RegistryUIMachineGenerated;
  libRegistryIndex: RegistryLibMachineGenerated;
}

export function addRelativeRegistries({
  userSelects,
  uiRegistryIndex,
  libRegistryIndex,
}: AddRelativeComponentsProps) {
  const selectedComponents: { type: "ui" | "lib"; name: string }[] = [];

  function addSeedDependencies({
    registryName,
    type,
  }: {
    registryName: string;
    type: "ui" | "lib";
  }) {
    if (selectedComponents.some((c) => c.name === registryName && c.type === type)) return;

    selectedComponents.push({ type, name: registryName });

    const registry =
      type === "ui"
        ? uiRegistryIndex.find((c) => c.name === registryName)
        : libRegistryIndex.find((c) => c.name === registryName);
    if (!registry) return;

    if (registry.innerDependencies) {
      for (const dep of registry.innerDependencies) {
        const [depType, depName] = dep.split(":");
        addSeedDependencies({ registryName: depName, type: depType as "ui" | "lib" });
      }
    }
  }

  for (const registryName of userSelects) {
    addSeedDependencies({ registryName, type: "ui" });
  }

  return Array.from(selectedComponents);
}
