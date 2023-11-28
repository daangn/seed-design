import * as icons from "@seed-design/icon";
import type { HeadFC } from "gatsby";

import SEO from "../../components/SEO";
import * as style from "../../styles/page-styles/icon-page.css";
import * as t from "../../styles/token.css";

const IconPage = () => {
  return (
    <article className={t.content}>
      <h1 className={style.heading1}>Monochrome Icon</h1>
      <div className={style.iconContainer}>
        {Object.entries(icons).map(([iconName, Icon]) => (
          <div className={style.iconBox} key={iconName}>
            <Icon className={style.icon} width={24} />
            <p className={style.iconName}>{iconName}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

// TODO:
export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Foundation | Color`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default IconPage;
