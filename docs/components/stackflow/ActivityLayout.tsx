import { AppScreen } from "@stackflow/plugin-basic-ui";

import IconExpandMore from "./icons/IconExpandMore";
import IconSearch from "./icons/IconSearch";
import IconSettings from "./icons/IconSettings";
import IconBell from "./icons/IconBell";
import IconHome from "./icons/IconHome";
import IconMenu from "./icons/IconMenu";
import IconSell from "./icons/IconSell";
import IconChatting from "./icons/IconChatting";
import IconProfile from "./icons/IconProfile";

type PropOf<T> = T extends React.ComponentType<infer U> ? U : never;

interface LayoutProps {
  appBar?: PropOf<typeof AppScreen>["appBar"];
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const appBarLeft = () => (
    <div className="flex text-[1.125rem] font-bold ml-[0.5rem]">
      Woolston
      <div className="flex items-center ml-[0.5rem]">
        <IconExpandMore />
      </div>
    </div>
  );

  const appBarRight = () => (
    <div className="grid grid-cols-[1.5rem 1.5rem 1.5rem] gap-[1rem] mr-[0.5rem]">
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
      <div className="absolute inset-0 flex flex-col leading-[1.15]">
        <div className="flex-1">{children}</div>
        <BottomTab />
      </div>
    </AppScreen>
  );
};

Layout.displayName = "Layout";

export default Layout;

const BottomTab: React.FC = () => (
  <div className="grid grid-cols-[1.5rem 1.5rem 1.5rem 1.5rem 1.5rem] justify-between p-[0.5rem] pb-[0.375rem] shadow-[0 -1px 0 0 #e0e0e0]">
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconHome />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">Home</div>
    </button>
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconMenu />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">Categories</div>
    </button>
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconSell />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">Sell</div>
    </button>
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconChatting />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">Chats</div>
    </button>
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconProfile />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">My</div>
    </button>
  </div>
);
