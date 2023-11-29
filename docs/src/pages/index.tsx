import ForwardIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconForwardFill";
import { vars } from "@seed-design/design-token";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";

import SEO from "../components/SEO";
import * as style from "../styles/page-styles/main.css";

const MainPage = () => {
  return (
    <article className={style.content}>
      <h1 className={style.title}>SEED Design</h1>

      <p className={style.description}>
        SEED는 메이커들이 효율적으로 제품을 만들 수 있도록
        <br />
        필요한 도구와 컴포넌트를 제공합니다.
        <br />
        SEED에서 제공하는 컴포넌트의 Usage 가이드,
        <br /> Spec 가이드를 확인할 수 있습니다.
      </p>

      <Link to="/component/">
        <button className={style.goDocsButton}>
          Document 보러가기
          <ForwardIcon width={28} />
        </button>
      </Link>

      <div className={style.cardList}>
        <Link to="/component/">
          <article
            style={{ backgroundColor: vars.$scale.color.blue50 }}
            className={style.cardContainer}
          >
            <p
              style={{ backgroundColor: vars.$scale.color.blue100 }}
              className={style.cardNumber}
            >
              1
            </p>
            <div className={style.cardContent}>
              <h1 className={style.cardTitle}>Component</h1>
              <p className={style.cardDescription}>
                컴포넌트의 시각적 정의와 올바른 상호작용을 위한 UX가이드
              </p>
            </div>
          </article>
        </Link>

        <Link to="/primitive/">
          <article
            style={{ backgroundColor: vars.$scale.color.green50 }}
            className={style.cardContainer}
          >
            <p
              style={{ backgroundColor: vars.$scale.color.green100 }}
              className={style.cardNumber}
            >
              2
            </p>
            <div className={style.cardContent}>
              <h1 className={style.cardTitle}>Primitive</h1>
              <p className={style.cardDescription}>
                컴포넌트의 시각적 정의를 제외한 본질적인 기능과 동작에 대한 정의
              </p>
            </div>
          </article>
        </Link>
      </div>
    </article>
  );
};

export default MainPage;

export const Head: HeadFC = () => {
  return (
    <SEO
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};
