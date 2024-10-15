import { docs, meta } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { create } from "@/components/ui/icon";
import { icons } from "lucide-react";

export const source = loader({
  baseUrl: "/docs",
  icon(icon) {
    if (icon && icon in icons)
      return create({ icon: icons[icon as keyof typeof icons] });
  },
  source: createMDXSource(docs, meta),
});
