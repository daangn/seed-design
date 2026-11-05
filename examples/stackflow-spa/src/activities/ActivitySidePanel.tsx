import { Article, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
} from "seed-design/ui/side-panel";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { Switch } from "seed-design/ui/switch";

declare module "@stackflow/config" {
  interface Register {
    ActivitySidePanel: {};
  }
}

const ActivitySidePanel: StaticActivityComponentType<"ActivitySidePanel"> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const [direction, setDirection] = useState<"left" | "right">("right");
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [showTitle, setShowTitle] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  const open = activity.isActive;
  const onOpenChange = (open: boolean) => !open && pop();

  return (
    <SidePanelRoot open={open} onOpenChange={onOpenChange} direction={direction} size={size}>
      <SidePanelContent
        title={showTitle ? "Side Panel" : undefined}
        description={showDescription ? "Side Panel 컴포넌트 데모입니다." : undefined}
        showCloseButton={showCloseButton}
        aria-label={showTitle ? undefined : "Side Panel"}
        layerIndex={useActivityZIndexBase()}
      >
        <SidePanelBody>
          <Article>
            Exercitation sint voluptate sunt minim ut eiusmod deserunt consectetur elit sit ex. Duis
            eiusmod non exercitation commodo mollit non elit consequat anim. Dolore enim deserunt
            ipsum dolor culpa incididunt enim non sit non commodo. Quis ex pariatur aute eiusmod
            nisi adipisicing sint nulla id. Et consectetur officia velit. Reprehenderit in qui ea
            nostrud irure amet ex ullamco in dolore consequat exercitation ut qui duis.Minim
            incididunt id consectetur laboris culpa exercitation commodo excepteur commodo. Deserunt
            aliqua officia et est aliquip consectetur do elit ad quis anim ullamco aliquip
            reprehenderit. Occaecat ex sint exercitation occaecat do exercitation Lorem exercitation
            deserunt sit proident ut Lorem ipsum et. Dolor ea eu sit qui amet. Qui pariatur ut
            voluptate laboris amet adipisicing esse. Nulla duis nostrud Lorem eu veniam qui sunt.
            Magna id dolore deserunt labore. Deserunt nulla labore sint officia commodo velit.Culpa
            labore eiusmod qui aute ea cupidatat. In velit est voluptate Lorem dolore consequat ea
            officia duis ex velit amet. Consequat esse sunt anim nulla do ea est velit occaecat duis
            aliqua non culpa ea. Labore ad non exercitation ex minim Lorem minim elit sint deserunt
            proident magna tempor voluptate nostrud. Qui eu qui ad quis fugiat mollit laboris
            incididunt do enim labore. Incididunt aliquip enim amet cupidatat. Id sunt in deserunt
            amet sit consectetur mollit irure officia ex non duis aute laborum. Aute elit
            adipisicing sunt exercitation cupidatat excepteur et in.Nulla Lorem eu amet veniam ea.
            Laborum minim elit officia nulla ad ipsum ipsum est minim aliquip. Et proident minim
            sunt culpa magna consectetur. Aliqua cupidatat officia voluptate exercitation ad Lorem
            occaecat occaecat fugiat sint esse adipisicing nisi adipisicing. Aliqua tempor
            reprehenderit anim. Eiusmod culpa occaecat cupidatat adipisicing dolor fugiat velit ex
            ad. Qui culpa et excepteur consectetur deserunt commodo ut esse velit labore ullamco
            adipisicing et et. Nulla commodo eu magna ex exercitation culpa sit.Non laborum velit
            nulla magna sint laboris commodo tempor. Aliquip voluptate laborum proident aliquip
            adipisicing proident deserunt Lorem reprehenderit ipsum commodo exercitation tempor
            velit. Id laboris incididunt minim velit amet pariatur. Ut reprehenderit est aute
            deserunt aliqua anim commodo laboris consectetur laborum do elit amet non exercitation.
            Pariatur cillum enim culpa esse. Eu irure id nostrud et in amet laboris sunt ut enim
            consequat amet magna qui. Adipisicing enim ea in nisi commodo.Ullamco aute proident elit
            aute sit adipisicing dolore mollit nostrud nulla excepteur pariatur aute amet commodo.
            Esse aliquip nulla reprehenderit est Lorem anim est esse duis sint amet. Nulla duis do
            sit proident labore sit consequat duis fugiat anim cillum consectetur. Esse anim dolore
            Lorem consequat commodo esse esse aliquip magna dolore est elit cupidatat id non. Culpa
            qui est duis esse. Tempor est enim magna anim quis qui excepteur aliquip.Ad laboris
            ullamco aliquip cillum elit. Id in nostrud sit aliqua ad adipisicing voluptate dolore
            consequat anim incididunt ut mollit. Dolore occaecat incididunt dolore est tempor ad
            nulla. Lorem eu esse minim cupidatat nulla eu id excepteur labore quis consectetur
            adipisicing ad consectetur. Aliqua ullamco officia officia duis et labore aliquip
            voluptate magna dolore fugiat labore aliqua eiusmod.Fugiat laborum qui mollit mollit
            fugiat eiusmod commodo anim duis reprehenderit ut amet non. Nisi consectetur ea
            adipisicing enim non sint est reprehenderit ea quis qui excepteur proident esse irure.
            Occaecat excepteur velit mollit. Ea laboris amet non anim consequat proident voluptate
            sit duis ex deserunt cupidatat. Reprehenderit minim veniam amet velit aute tempor
            aute.Minim nulla magna elit nisi anim amet cupidatat. Minim cillum tempor ut ex. Ipsum
            aliqua adipisicing incididunt nulla. Aute pariatur irure enim et do adipisicing est
            pariatur excepteur adipisicing Lorem tempor nisi exercitation. Proident veniam excepteur
            quis anim minim sint consequat ut pariatur dolor nulla. Occaecat in minim non. Sit nisi
            in consectetur id aliquip sunt consectetur ex sunt voluptate pariatur laboris sit.Sint
            ad aute est mollit qui exercitation qui deserunt aliqua ea mollit aute aliqua incididunt
            ipsum. Adipisicing veniam dolore qui duis ex dolor reprehenderit sint reprehenderit
            eiusmod aute ullamco deserunt. Aliqua velit officia amet id dolore exercitation est
            culpa eiusmod dolore magna dolore. Ullamco in sint quis consequat culpa deserunt. Aute
            incididunt ex duis minim tempor deserunt aute cillum et eiusmod laboris minim do. Duis
            veniam consequat consectetur duis tempor ea ipsum culpa nostrud pariatur.
          </Article>
          <VStack gap="x4">
            <VStack gap="x2">
              <SegmentedControl
                aria-label="패널 방향"
                value={direction}
                onValueChange={(v) => setDirection(v as "left" | "right")}
                style={{ width: "100%" }}
              >
                <SegmentedControlItem value="left">Left</SegmentedControlItem>
                <SegmentedControlItem value="right">Right</SegmentedControlItem>
              </SegmentedControl>
            </VStack>

            <VStack gap="x2">
              <SegmentedControl
                aria-label="패널 크기"
                value={size}
                onValueChange={(v) => setSize(v as "small" | "medium" | "large")}
                style={{ width: "100%" }}
              >
                <SegmentedControlItem value="small">Small</SegmentedControlItem>
                <SegmentedControlItem value="medium">Medium</SegmentedControlItem>
                <SegmentedControlItem value="large">Large</SegmentedControlItem>
              </SegmentedControl>
            </VStack>

            <VStack gap="x3">
              <Switch
                tone="neutral"
                size="16"
                label="제목 표시"
                checked={showTitle}
                onCheckedChange={setShowTitle}
              />
              <Switch
                tone="neutral"
                size="16"
                label="설명 표시"
                checked={showDescription}
                onCheckedChange={setShowDescription}
              />
              <Switch
                tone="neutral"
                size="16"
                label="닫기 버튼 표시"
                checked={showCloseButton}
                onCheckedChange={setShowCloseButton}
              />
              <Switch
                tone="neutral"
                size="16"
                label="푸터 표시"
                checked={showFooter}
                onCheckedChange={setShowFooter}
              />
            </VStack>
          </VStack>
        </SidePanelBody>
        {showFooter && (
          <SidePanelFooter>
            <VStack gap="x2">
              <ActionButton variant="neutralWeak" onClick={() => pop()}>
                닫기
              </ActionButton>
              <ActionButton variant="neutralSolid">확인</ActionButton>
            </VStack>
          </SidePanelFooter>
        )}
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default ActivitySidePanel;
