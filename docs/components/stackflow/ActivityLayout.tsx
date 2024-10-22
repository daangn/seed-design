import { AppScreen } from "@stackflow/plugin-basic-ui";

import {
  IconChevronDownFill,
  IconChevronDownLine,
  IconDot3HorizontalChatbubbleLeftLine,
  IconGearLine,
  IconHorizline3VerticalLine,
  IconHouseLine,
  IconPersonLine,
  IconPlusSquareFill,
} from "@daangn/react-icon";

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
        <IconChevronDownLine />
      </div>
    </div>
  );

  const appBarRight = () => (
    <div className="grid grid-cols-[1.5rem 1.5rem 1.5rem] gap-[1rem] mr-[0.5rem]">
      <IconGearLine />
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
  <div className="grid grid-cols-5 justify-between p-[0.5rem] pb-[0.375rem] shadow-[0 -1px 0 0 #e0e0e0] bg-white">
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconHouseLine />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">Home</div>
    </button>
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconHorizline3VerticalLine />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">Categories</div>
    </button>
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconPlusSquareFill />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">Sell</div>
    </button>
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconDot3HorizontalChatbubbleLeftLine />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">Chats</div>
    </button>
    <button type="button" className="flex flex-col items-center cursor-pointer">
      <div className="mb-[0.375rem]">
        <IconPersonLine />
      </div>
      <div className="whitespace-nowrap text-[0.75rem]">My</div>
    </button>
  </div>
);
