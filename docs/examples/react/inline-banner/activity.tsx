import * as React from "react";

import { ActionButton } from "seed-design/ui/action-button";
import { InlineBanner, type InlineBannerProps } from "seed-design/ui/inline-banner";
import type { ActivityComponentType } from "@stackflow/react/future";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";

declare module "@stackflow/config" {
  interface Register {
    "react/inline-banner/activity": {};
  }
}

const InlineBannerActivity: ActivityComponentType<"react/inline-banner/activity"> = () => {
  const [variant, setVariant] =
    React.useState<Extract<InlineBannerProps["variant"], "neutralWeak" | "criticalSolid">>(
      "criticalSolid",
    );

  return (
    <AppScreen>
      <AppBar>
        <AppBarMain>Inline Banner</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <InlineBanner
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          variant={variant}
          {...(variant === "criticalSolid" && { style: { position: "sticky", top: 0 } })}
        />
        <div style={{ display: "flex", flexDirection: "column", padding: "1rem", gap: "0.75rem" }}>
          <ActionButton
            onClick={() =>
              setVariant((prev) => (prev === "criticalSolid" ? "neutralWeak" : "criticalSolid"))
            }
          >
            Toggle tone
          </ActionButton>
          <p style={{ marginBlock: 0, lineHeight: 1.35 }}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. At a eaque fugiat sint
            sapiente. Id, hic ex, blanditiis totam animi amet delectus temporibus quae fugiat
            magnam, quos eaque dolorum a? Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Possimus labore unde minus temporibus beatae commodi et nesciunt iure in dignissimos
            suscipit, alias ab voluptatem facilis tempora numquam. Veritatis, dolorum suscipit!
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo fugiat molestias
            iusto, ipsum distinctio officia ad id ratione esse ducimus architecto deleniti illum
            reiciendis rerum, at blanditiis molestiae. Cupiditate, nobis? Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Ab, magni. Aliquid inventore quaerat nemo architecto harum
            earum quas porro repudiandae explicabo repellat repellendus magni, corporis omnis
            laborum, velit dicta blanditiis. Lorem ipsum dolor sit, amet consectetur adipisicing
            elit. Debitis, eveniet quas. Accusamus facere veritatis expedita delectus, asperiores
            numquam placeat necessitatibus assumenda, nesciunt in dolorem sit provident repellendus,
            voluptatem earum! Consequatur. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Aut earum asperiores aliquam magnam est delectus veritatis numquam sint porro tenetur
            dolores nobis, deleniti voluptas quaerat, quia voluptatum soluta autem perspiciatis?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis possimus eaque aliquam
            maxime? Quidem enim, sed itaque at veritatis nihil officia esse qui provident ipsa
            adipisci necessitatibus officiis distinctio laborum!
          </p>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default InlineBannerActivity;
