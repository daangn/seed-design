import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { tagGroup, type TagGroupVariantProps } from "@ride-developer/css/recipes/tag-group";
import {
  tagGroupItem,
  type TagGroupItemVariantProps,
} from "@ride-developer/css/recipes/tag-group-item";
import { forwardRef, Children, Fragment } from "react";
import clsx from "clsx";
import { splitMultipleVariantsProps } from "../../utils/splitMultipleVariantsProps";
import { useStyleProps, type StyleProps } from "../../utils/styled";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { PropsProvider, useProps, withContext, ClassNamesProvider } =
  createSlotRecipeContext(tagGroupItem);

export interface TagGroupRootProps
  extends TagGroupVariantProps,
    TagGroupItemVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  separator?: React.ReactNode;
}

export const TagGroupRoot = forwardRef<HTMLSpanElement, TagGroupRootProps>(
  ({ className, children, separator = " · ", ...props }, ref) => {
    const [{ tagGroup: tagGroupVariantProps, tagGroupItem: tagGroupItemVariantProps }, otherProps] =
      splitMultipleVariantsProps(props, { tagGroup, tagGroupItem });
    const classNames = tagGroup(tagGroupVariantProps);

    return (
      <PropsProvider value={tagGroupItemVariantProps}>
        <Primitive.span ref={ref} className={clsx(classNames.root, className)} {...otherProps}>
          {Children.toArray(children)
            // putting something other than TagGroupItem in TagGroupRoot is not a good idea,
            // but we shouldn't throw an error for it either
            // thus .filter(React.isValidElement) is too strict here
            .filter(Boolean)
            .map((child, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: those fragments won't change order
              <Fragment key={index}>
                {index > 0 && (
                  <Primitive.span aria-hidden className={classNames.separator}>
                    {separator}
                  </Primitive.span>
                )}
                {child}
              </Fragment>
            ))}
        </Primitive.span>
      </PropsProvider>
    );
  },
);

export interface TagGroupItemProps
  extends TagGroupItemVariantProps,
    Pick<StyleProps, "flexShrink">,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TagGroupItem = forwardRef<HTMLSpanElement, TagGroupItemProps>(
  ({ className, ...props }, ref) => {
    const parentVariantProps = useProps();

    const [variantProps, otherProps] = tagGroupItem.splitVariantProps(props);
    const classNames = tagGroupItem({ ...parentVariantProps, ...variantProps });

    const { style, restProps } = useStyleProps(otherProps);

    return (
      <ClassNamesProvider value={classNames}>
        <Primitive.span
          ref={ref}
          style={style}
          className={clsx(classNames.root, className)}
          {...restProps}
        />
      </ClassNamesProvider>
    );
  },
);

export interface TagGroupItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TagGroupItemLabel = withContext<HTMLSpanElement, TagGroupItemLabelProps>(
  Primitive.span,
  "label",
);
