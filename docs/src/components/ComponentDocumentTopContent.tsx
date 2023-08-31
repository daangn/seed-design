import { IconArrowFill } from "@seed-design/icon";
import { Link } from "gatsby";
import * as React from "react";

import * as styles from "../templates/ComponentCommon.css";
import ComponentDocumentCategoryNav from "./ComponentDocumentCategoryNav";

interface ComponentDocumentTopContentProps {
  title: string;
  description: string;
  path: string;
  primitiveLink?: string;
}

const ComponentDocumentTopContent = ({
  title,
  description,
  path,
  primitiveLink,
}: ComponentDocumentTopContentProps) => {
  return (
    <>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{title}</h1>
        {primitiveLink && (
          <Link to={primitiveLink} className={styles.primitiveLink}>
            <span className={styles.primitiveText}>Primitive</span>
            <IconArrowFill width={20} />
          </Link>
        )}
      </div>
      <p className={styles.titleDescription}>{description}</p>
      <ComponentDocumentCategoryNav currentPath={path} />
    </>
  );
};

export default ComponentDocumentTopContent;
