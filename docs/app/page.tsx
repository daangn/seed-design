import type { Metadata } from "next";
import { BrandFooter } from "@/components/landing/brand-footer";
import { FloatingHeader } from "@/components/landing/floating-header";
import { Hero } from "@/components/landing/hero";

export default function HomePage() {
  return (
    <main data-landing="true" className="min-h-screen bg-palette-carrot-600">
      <FloatingHeader />
      <Hero />
      <BrandFooter />
    </main>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "SEED Design System",
    description: "SEED 디자인 시스템은 당근 제품을 위한 통합된 디자인 언어입니다.",
  };
}
