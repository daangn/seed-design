import { classNames } from "@seed-design/design-token";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import React from "react";

import DocumentEditLink from "../components/DocumentEditLink";
import Layout from "../components/Layout";
import * as style from "./ComponentsContentTemplate.css";

interface TemplatePostProps {
  children: React.ReactNode;
  pageContext: {
    title: string;
    description: string;
    slug: string;
    activeTab: string;
  };
}

const ComponentsContentTemplate: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  return (
    <Layout>
      <main>
        <section
          style={{
            maxWidth: "900px",
            margin: "50px auto",
            wordBreak: "keep-all",
            overflowWrap: "break-word",
            lineHeight: "1.7",
            letterSpacing: "-0.04px",
          }}
        >
          <h1 className={clsx(classNames.$semantic.typography.h1, style.title)}>
            {pageContext.title}
          </h1>
          <p
            className={clsx(
              classNames.$semantic.typography.title2Bold,
              style.titleDescription,
            )}
          >
            {pageContext.description}
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Link
              to={`${pageContext.slug}/primitive`}
              className={clsx(
                classNames.$semantic.typography.title2Bold,
                style.tabLink({
                  active: pageContext.activeTab === "primitive",
                }),
              )}
            >
              primitive
            </Link>
            <Link
              to={`${pageContext.slug}/visual`}
              className={clsx(
                classNames.$semantic.typography.title2Bold,
                style.tabLink({
                  active: pageContext.activeTab === "visual",
                }),
              )}
            >
              visual
            </Link>
          </div>
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
          <DocumentEditLink slug={pageContext.slug} />
        </section>
      </main>
    </Layout>
  );
};

export const Head: HeadFC = () => <title>Component page</title>;

export default ComponentsContentTemplate;
