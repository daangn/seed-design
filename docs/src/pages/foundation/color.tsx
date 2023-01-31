import { vars } from "@seed-design/design-token";
import type { HeadFC } from "gatsby";

import SEO from "../../components/SEO";
import * as style from "../../styles/page-styles/color.page.css";
import * as t from "../../styles/token.css";

const ColorItem = ({ name, color }: { name: string; color: string }) => {
  return (
    <li className={style.listItem}>
      <span className={style.listItemText}>{name}</span>
      <div
        className={style.listItemBox}
        style={{
          backgroundColor: color,
        }}
      />
    </li>
  );
};

const FoundationColorPage = () => {
  return (
    <article className={t.content}>
      <h1 className={style.heading1}>Color</h1>

      <h2 className={style.heading2}>Scale Color</h2>
      <ul className={style.list}>
        {Object.entries(vars.$scale.color).map(([name, color]) => (
          <ColorItem key={name} name={name} color={color} />
        ))}
      </ul>

      <h2 className={style.heading2}>Semantic Color</h2>
      <ul className={style.list}>
        {Object.entries(vars.$semantic.color).map(([name, color]) => (
          <ColorItem key={name} name={name} color={color} />
        ))}
      </ul>

      <h2 className={style.heading2}>Static Color</h2>
      <ul className={style.list}>
        {Object.entries(vars.$static.color).map(([name, color]) => (
          <ColorItem key={name} name={name} color={color} />
        ))}
      </ul>
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

export default FoundationColorPage;
