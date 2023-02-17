import type { HeadFC } from "gatsby";

import SeedIcon, { IconNames } from "../../components/SeedIcon";
import SEO from "../../components/SEO";
import * as listPageStyle from "../../styles/page-styles/list-page.css";
import * as t from "../../styles/token.css";

const IconListPage = () => {
  return (
    <article className={listPageStyle.content}>
      <h1 className={listPageStyle.title}>Icon</h1>
      <p className={listPageStyle.caption1}>
        컴포넌트 구성에 필요한 기본적인 요소들
      </p>
      <h2 className={t.documentHeading2}>준비중...</h2>
      {IconNames.map((name) => (
        <SeedIcon name={name} size={20} />
      ))}
    </article>
  );
};

// TODO:
export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Icon`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default IconListPage;
