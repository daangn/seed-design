import { h } from "preact";

import { ListItemButton } from "@/shared/components/list";
import { Button } from "@create-figma-plugin/ui";
import { useComponentsContext } from "./context";

export const NewComponentList = () => {
  const { newComponents, swapResults, selectedComponent, handleSelectComponent } =
    useComponentsContext();

  return newComponents.length > 0 ? (
    <ul className="flex flex-col overflow-y-auto h-[300px]">
      <div className="sticky top-0 text-[10px] text-green-600 p-2 bg-white z-10">
        신규 컴포넌트 <span className="font-bold">{newComponents.length}개</span> 존재
      </div>
      {newComponents.map((newComponent) => {
        const swapResult = swapResults[newComponent.id];
        const endElement = swapResult ? (
          swapResult.ok ? (
            <span className="text-green-600 text-[10px] max-w-[300px]">
              {swapResult.metadata?.newComponentName}로 교체 완료했어요.
            </span>
          ) : (
            <span className="text-red-600 text-[10px] max-w-[300px]">
              {swapResult.errorMessage}
            </span>
          )
        ) : null;
        return (
          <ListItemButton
            className="bg-green-100"
            isDimmed={false}
            endElement={endElement}
            isFocused={selectedComponent?.id === newComponent.id}
            key={newComponent.id}
            title={newComponent.name}
            onClick={() => handleSelectComponent(newComponent)}
          />
        );
      })}
    </ul>
  ) : null;
};

export const OldComponentList = () => {
  const {
    oldComponents,
    swapResults,
    selectedComponent,
    swapComponent,
    selectedVariants,
    handleSelectComponent,
  } = useComponentsContext();

  return oldComponents.length > 0 ? (
    <ul className="flex flex-col overflow-y-auto h-[300px]">
      <div className="sticky top-0 text-[10px] p-2 bg-white z-10">
        이전 컴포넌트 <span className="font-bold">{oldComponents.length}개</span> 존재
      </div>
      {oldComponents.map((oldComponent) => {
        const swapResult = swapResults[oldComponent.id];
        const isSuccess = swapResult?.ok;
        const errorMessage = swapResult?.errorMessage;

        const endElement = swapResult ? (
          isSuccess ? (
            <span className="text-green-600 text-[10px] max-w-[300px]">
              {swapResult.metadata?.newComponentName}로 교체 완료했어요.
            </span>
          ) : (
            <span className="text-red-600 text-[10px] max-w-[300px]">{errorMessage}</span>
          )
        ) : null;

        return (
          <div className="flex flex-col" key={oldComponent.id}>
            <ListItemButton
              key={oldComponent.id}
              title={oldComponent.name}
              endElement={
                <div className="flex items-center gap-0.5">
                  {endElement}
                  <Button secondary onClick={() => swapComponent(oldComponent, selectedVariants)}>
                    교체
                  </Button>
                </div>
              }
              onClick={() => handleSelectComponent(oldComponent)}
              isDimmed={false}
              isFocused={selectedComponent?.id === oldComponent.id}
              className="last-of-type:border-b-[1px]"
            />
          </div>
        );
      })}
    </ul>
  ) : null;
};
