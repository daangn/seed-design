import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { searchInput } from "@seed-design/lynx-css/recipes/search-input";
import {
  TextFieldProvider,
  useTextField,
  useTextFieldContext,
  useTextFieldInput,
  type UseTextFieldProps,
} from "@seed-design/lynx-react-text-field";
import clsx from "clsx";

import type { LynxHostProps, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { IconSlotProvider } from "../Icon/Icon";
import { mergeProps } from "../../utils/merge-props";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(searchInput);

interface SearchInputSubmitContextValue {
  onSubmit?: (value: string) => void;
  blurOnSubmit: boolean;
}

const SearchInputSubmitContext = React.createContext<SearchInputSubmitContextValue>({
  blurOnSubmit: true,
});

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-text-field`의 값 상태 위에 SEED search-input recipe를 조립한다.
 */
export interface SearchInputRootProps
  extends Pick<UseTextFieldProps, "value" | "defaultValue" | "onValueChange" | "name">,
    Omit<LynxHostProps<"view">, keyof UseTextFieldProps> {
  /**
   * 키보드의 검색(확인) 키를 누르면 현재 값과 함께 호출된다.
   */
  onSubmit?: (value: string) => void;

  /**
   * 제출한 뒤 입력의 focus를 해제해 키보드를 내린다.
   * @default true
   */
  blurOnSubmit?: boolean;
}

export const SearchInputRoot = React.forwardRef<NodesRef, SearchInputRootProps>(
  (props, forwardedRef) => {
    const {
      children,
      className,
      value,
      defaultValue,
      onValueChange,
      name,
      onSubmit,
      blurOnSubmit = true,
      ...nativeProps
    } = props;
    const api = useTextField({ value, defaultValue, onValueChange, name });
    const classes = searchInput();
    const rootRef = api.rootRef;
    const mergedRef = React.useMemo(
      () => mergeProps({ ref: rootRef }, { ref: forwardedRef }).ref,
      [rootRef, forwardedRef],
    );
    const submitContext = React.useMemo(
      () => ({ onSubmit, blurOnSubmit }),
      [onSubmit, blurOnSubmit],
    );

    return (
      <TextFieldProvider value={api}>
        <SearchInputSubmitContext.Provider value={submitContext}>
          <ClassNamesProvider value={classes}>
            <view
              {...mergeProps({ ref: mergedRef }, nativeProps)}
              className={clsx(classes.root, className)}
            >
              {children}
            </view>
          </ClassNamesProvider>
        </SearchInputSubmitContext.Provider>
      </TextFieldProvider>
    );
  },
);
SearchInputRoot.displayName = "SearchInputRoot";

////////////////////////////////////////////////////////////////////////////////////

type NativeInputProps = IntrinsicElements["input"];

/**
 * @platform Lynx
 *
 * `confirm-type`은 `"search"`로 고정한다. 화면에 보이는 레이블이 없으므로 `accessibility-label`이 필요하다.
 */
export interface SearchInputInputProps
  extends Omit<LynxHostProps<"input">, "children" | "confirm-type"> {}

export const SearchInputInput = React.forwardRef<NodesRef, SearchInputInputProps>((props, ref) => {
  const classes = useClassNames();
  const { onSubmit, blurOnSubmit } = React.useContext(SearchInputSubmitContext);
  const { className, bindconfirm, ...otherProps } = props;
  const api = useTextFieldInput(otherProps, ref);
  const { blur } = api;

  if (process.env.NODE_ENV !== "production" && !props["accessibility-label"]) {
    console.warn("SearchInputInput: Please provide `accessibility-label` for accessibility.");
  }

  const handleConfirm = React.useCallback<NonNullable<NativeInputProps["bindconfirm"]>>(
    (event) => {
      "background only";

      onSubmit?.(event.detail.value);
      bindconfirm?.(event);
      if (blurOnSubmit) blur();
    },
    [blur, blurOnSubmit, bindconfirm, onSubmit],
  );

  return (
    <input
      {...api.inputProps}
      confirm-type="search"
      bindconfirm={handleConfirm}
      className={clsx(classes.value, className)}
    />
  );
});
SearchInputInput.displayName = "SearchInputInput";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 값이 비어 있으면 렌더링하지 않는다. 탭하면 `setValue("")`로 값을 비운다.
 * `ignore-focus`로 탭이 입력의 focus를 가져가지 않게 해, focus가 있었으면 유지하고 없었으면 새로 주지 않는다.
 * children에는 `<Icon icon={...} />`을 넣는다.
 */
export interface SearchInputClearButtonProps extends LynxHostProps<"view"> {}

export const SearchInputClearButton = React.forwardRef<unknown, SearchInputClearButtonProps>(
  (props, ref) => {
    const classes = useClassNames();
    const { value, disabled, readOnly, setValue } = useTextFieldContext();
    const { children, className, bindtap, ...nativeProps } = props;

    if (process.env.NODE_ENV !== "production" && !props["accessibility-label"]) {
      console.warn(
        "SearchInputClearButton: Please provide `accessibility-label` for accessibility.",
      );
    }

    const handleTap = React.useCallback<NonNullable<IntrinsicElements["view"]["bindtap"]>>(
      (event) => {
        "background only";

        setValue("");
        bindtap?.(event);
      },
      [bindtap, setValue],
    );

    if (value === "" || disabled || readOnly) return null;

    return (
      <view
        {...mergeProps(
          {
            "accessibility-element": true,
            "accessibility-traits": "button" as const,
            "ignore-focus": true,
          },
          nativeProps,
          ref ? { ref: ref as LynxViewRef } : {},
        )}
        bindtap={handleTap}
        className={clsx(classes.clearButton, className)}
      >
        <IconSlotProvider
          value={{ classNames: { icon: classes.clearButtonIcon }, deps: [classes.clearButtonIcon] }}
        >
          {children}
        </IconSlotProvider>
      </view>
    );
  },
);
SearchInputClearButton.displayName = "SearchInputClearButton";
