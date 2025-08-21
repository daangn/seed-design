import type { RegistryUI } from "./schema";

export const registryBits: RegistryUI = [
  {
    name: "animate-number",
    description: "숫자를 부드럽게 애니메이션하는 컴포넌트",
    files: [
      "bits:animate-number/animate-number.tsx",
      "bits:animate-number/animate-number.module.css",
    ],
    dependencies: ["motion"],
  },
];
