import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import React from "react";

import DocumentLayout from "../components/DocumentLayout";
import EditLink from "../components/EditLink";
import * as style from "./OverviewContentTemplate.css";

interface TemplatePostProps {
  children: React.ReactNode;
  pageContext: {
    slug: string;
  };
}

const OverviewContentTemplate: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  return (
    <DocumentLayout>
      <main className={style.main}>
        <motion.div
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
        >
          {children}
        </motion.div>
        <EditLink slug={pageContext.slug} />
      </main>
    </DocumentLayout>
  );
};

export const Head: HeadFC = () => <title>Component page</title>;

export default OverviewContentTemplate;
