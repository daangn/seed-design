import { AnimatePresence, motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useEffect, useRef } from "react";

import * as style from "./Anatomy.css";

const Anatomy = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsIntersecting(true);
        if (!entry.isIntersecting) setIsIntersecting(false);
      });
    };

    const option: IntersectionObserverInit = {
      rootMargin: "0px 0px 0px 0px",
    };

    const observer = new IntersectionObserver(callback, option);

    observer.observe(ref.current!);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={ref}>{children}</div>
      <AnimatePresence>
        {!isIntersecting && (
          <motion.div
            className={style.image}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            whileHover={{ scale: 2, x: -125, y: -60 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Anatomy;
