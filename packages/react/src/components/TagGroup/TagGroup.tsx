import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { tagGroup, type TagGroupVariantProps } from "@seed-design/css/recipes/tag-group";
import {
  tagGroupItem,
  type TagGroupItemVariantProps,
} from "@seed-design/css/recipes/tag-group-item";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { forwardRef, Children } from "react";
import clsx from "clsx";
import { splitMultipleVariantsProps } from "../../utils/splitMultipleVariantsProps";
import { mergeProps } from "@seed-design/dom-utils";

const { PropsProvider, useProps } = createRecipeContext(tagGroupItem);

export interface TagGroupRootProps
  extends TagGroupVariantProps,
    TagGroupItemVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  delimiter?: React.ReactNode;
}

export const TagGroupRoot = forwardRef<HTMLSpanElement, TagGroupRootProps>(
  ({ className, children, delimiter = "  ·  ", ...props }, ref) => {
    const [{ tagGroup: tagGroupVariantProps, tagGroupItem: tagGroupItemVariantProps }, otherProps] =
      splitMultipleVariantsProps(props, { tagGroup, tagGroupItem });
    const classNames = tagGroup(tagGroupVariantProps);

    return (
      <PropsProvider value={tagGroupItemVariantProps}>
        <Primitive.span ref={ref} className={clsx(classNames.root, className)} {...otherProps}>
          {Children.map(children, (child, index) => (
            <>
              {index > 0 && (
                <Primitive.span aria-hidden className={classNames.delimiter}>
                  {delimiter}
                </Primitive.span>
              )}
              {child}
            </>
          ))}
        </Primitive.span>
      </PropsProvider>
    );
  },
);

export interface TagGroupItemProps
  extends TagGroupItemVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TagGroupItem = forwardRef<HTMLSpanElement, TagGroupItemProps>((props, ref) => {
  const parentVariantProps = useProps();

  const [variantProps, { className, ...otherProps }] = tagGroupItem.splitVariantProps(props);
  const recipeClassName = tagGroupItem(mergeProps(parentVariantProps, variantProps));

  return <Primitive.span ref={ref} className={clsx(recipeClassName, className)} {...otherProps} />;
});
