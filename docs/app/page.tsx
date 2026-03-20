import type { Metadata } from "next";
import { redirect } from "next/navigation";
export default async function HomePage() {
  return redirect("/docs");
}

export function generateMetadata(): Metadata {
  return {
    title: "SEED Design System",
    description: "SEED 디자인 시스템은 당근 제품을 위한 통합된 디자인 언어입니다.",
  };
}
