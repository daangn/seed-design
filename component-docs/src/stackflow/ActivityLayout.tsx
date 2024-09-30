import { AppScreen } from "@stackflow/plugin-basic-ui";

import IconExpandMore from "@/src/assets/IconExpandMore";
import IconSearch from "@/src/assets/IconSearch";
import IconSettings from "@/src/assets/IconSettings";
import IconBell from "@/src/assets/IconBell";
import IconHome from "@/src/assets/IconHome";
import IconMenu from "@/src/assets/IconMenu";
import IconSell from "@/src/assets/IconSell";
import IconChatting from "@/src/assets/IconChatting";
import IconProfile from "@/src/assets/IconProfile";

import * as css from "./ActivityLayout.css";

type PropOf<T> = T extends React.ComponentType<infer U> ? U : never;

interface LayoutProps {
  appBar?: PropOf<typeof AppScreen>["appBar"];
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const appBarLeft = () => (
    <div className={css.appBarLeft}>
      Woolston
      <div className={css.appBarLeftIcon}>
        <IconExpandMore />
      </div>
    </div>
  );

  const appBarRight = () => (
    <div className={css.appBarRight}>
      <IconSearch />
      <IconSettings />
      <IconBell />
    </div>
  );

  return (
    <AppScreen
      appBar={{
        renderLeft: appBarLeft,
        renderRight: appBarRight,
      }}
    >
      <div className={css.wrapper}>
        <div className={css.content}>{children}</div>
        <BottomTab />
      </div>
    </AppScreen>
  );
};

Layout.displayName = "Layout";

export default Layout;

const BottomTab: React.FC = () => (
  <div className={css.container}>
    <button type="button" className={css.button}>
      <div className={css.buttonIcon}>
        <IconHome />
      </div>
      <div className={css.buttonLabel}>Home</div>
    </button>
    <button type="button" className={css.button}>
      <div className={css.buttonIcon}>
        <IconMenu />
      </div>
      <div className={css.buttonLabel}>Categories</div>
    </button>
    <button type="button" className={css.button}>
      <div className={css.buttonIcon}>
        <IconSell />
      </div>
      <div className={css.buttonLabel}>Sell</div>
    </button>
    <button type="button" className={css.button}>
      <div className={css.buttonIcon}>
        <IconChatting />
      </div>
      <div className={css.buttonLabel}>Chats</div>
    </button>
    <button type="button" className={css.button}>
      <div className={css.buttonIcon}>
        <IconProfile />
      </div>
      <div className={css.buttonLabel}>My</div>
    </button>
  </div>
);
