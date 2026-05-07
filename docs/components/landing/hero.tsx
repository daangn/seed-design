"use client";

import { motion } from "motion/react";
import { BrandLogo } from "./brand-logo";

export function Hero() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center bg-palette-carrot-600">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <BrandLogo width={500} priority />
      </motion.div>
    </section>
  );
}
