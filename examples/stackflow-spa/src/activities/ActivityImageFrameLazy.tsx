import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Avatar, ImageFrame } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { useMemo } from "react";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityImageFrameLazy: {};
  }
}

const buildSrc = (label: string, color: string, sessionKey: string) =>
  `https://placehold.co/600x400/${color}/ffffff?text=${encodeURIComponent(label)}&v=${sessionKey}`;

const ActivityImageFrameLazy: StaticActivityComponentType<"ActivityImageFrameLazy"> = () => {
  const { push } = useFlow();

  // crypto.getRandomValues로 매 마운트마다 다른 cache-bust 키를 생성한다.
  // (Math.random은 보안 컨텍스트가 아니어도 CodeQL이 경고를 발생시키므로 회피)
  const sessionKey = useMemo(() => {
    const random = new Uint32Array(1);
    globalThis.crypto.getRandomValues(random);
    return random[0].toString(36);
  }, []);

  const src = useMemo(
    () => ({
      lazyImageFrame: buildSrc("ImageFrame · lazy", "ff7a00", sessionKey),
      eagerImageFrame: buildSrc("ImageFrame · eager", "4c6fff", sessionKey),
      lazyAvatar: buildSrc("Avatar · lazy", "00b894", sessionKey),
      eagerAvatar: buildSrc("Avatar · eager", "8e44ad", sessionKey),
    }),
    [sessionKey],
  );

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>ImageFrame Lazy 재현</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <section style={{ padding: 16, lineHeight: 1.5 }}>
          <strong>ImageFrame / Avatar `loading="lazy"` 데드락 재현</strong>
          <p>
            아래로 스크롤하면 lazy 이미지가 viewport에 들어옵니다. 데드락이 살아있으면 lazy 이미지는
            영원히 fallback 상태에 머무르고, 같은 src를 <code>loading="eager"</code>로 둔 대조군은
            정상 표시됩니다.
          </p>
          <p style={{ color: "#888", fontSize: 12 }}>
            DevTools Network 패널에서 lazy 이미지 src에 대한 요청이 발생하지 않는지 확인하세요.
          </p>
        </section>

        <div
          style={{
            height: "200vh",
            padding: 16,
            background: "linear-gradient(180deg, #fff 0%, #f5f5f5 100%)",
            color: "#888",
          }}
        >
          ↓ 아래로 계속 스크롤하세요 (200vh spacer)
        </div>

        <section style={{ padding: 16, display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <h3 style={{ marginBottom: 8 }}>ImageFrame · loading="lazy"</h3>
            <ImageFrame
              ratio={16 / 9}
              src={src.lazyImageFrame}
              alt="ImageFrame lazy"
              loading="lazy"
              fallback={<div style={{ background: "#eee", height: "100%" }}>fallback</div>}
            />
          </div>

          <div>
            <h3 style={{ marginBottom: 8 }}>ImageFrame · loading="eager" (대조군)</h3>
            <ImageFrame
              ratio={16 / 9}
              src={src.eagerImageFrame}
              alt="ImageFrame eager"
              loading="eager"
              fallback={<div style={{ background: "#eee", height: "100%" }}>fallback</div>}
            />
          </div>

          <div>
            <h3 style={{ marginBottom: 8 }}>Avatar · loading="lazy"</h3>
            <Avatar.Root size="96">
              <Avatar.Fallback>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    background: "#eee",
                  }}
                >
                  L
                </div>
              </Avatar.Fallback>
              <Avatar.Image src={src.lazyAvatar} alt="Avatar lazy" loading="lazy" />
            </Avatar.Root>
          </div>

          <div>
            <h3 style={{ marginBottom: 8 }}>Avatar · loading="eager" (대조군)</h3>
            <Avatar.Root size="96">
              <Avatar.Fallback>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    background: "#eee",
                  }}
                >
                  E
                </div>
              </Avatar.Fallback>
              <Avatar.Image src={src.eagerAvatar} alt="Avatar eager" loading="eager" />
            </Avatar.Root>
          </div>
        </section>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityImageFrameLazy;
