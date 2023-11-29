import type { HeadFC } from "gatsby";

import { FoundationColorDocumentHeader } from "../../../components/FoundationColorDocumentHeader";
import SEO from "../../../components/SEO";
import * as t from "../../../styles/token.css";

const ColorUsagePage = () => {
  return (
    <article className={t.content}>
      <FoundationColorDocumentHeader currentPath="usage" />
    </article>
  );
};

// TODO:
export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Foundation | Color | Usage`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default ColorUsagePage;
