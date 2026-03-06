import './action-button.css';
import { createClassName, mergeVariants } from './shared';

type Variant =
  | 'brandSolid'
  | 'neutralSolid'
  | 'neutralWeak'
  | 'criticalSolid'
  | 'brandOutline'
  | 'neutralOutline'
  | 'ghost';
type Size = 'xsmall' | 'small' | 'medium' | 'large';
type Layout = 'withText' | 'iconOnly';

export interface ActionButtonVariantProps {
  variant?: Variant;
  size?: Size;
  layout?: Layout;
}

export interface ActionButtonClasses {
  root: string;
  text: string;
}

const defaultVariant = {
  variant: 'brandSolid',
  size: 'medium',
  layout: 'withText',
};

const compoundVariants = [
  { size: 'xsmall', layout: 'withText' },
  { size: 'xsmall', layout: 'iconOnly' },
  { size: 'small', layout: 'withText' },
  { size: 'small', layout: 'iconOnly' },
  { size: 'medium', layout: 'withText' },
  { size: 'medium', layout: 'iconOnly' },
  { size: 'large', layout: 'withText' },
  { size: 'large', layout: 'iconOnly' },
];

const textCompoundVariants = [
  { size: 'xsmall', layout: 'withText' },
  { size: 'small', layout: 'withText' },
  { size: 'medium', layout: 'withText' },
  { size: 'large', layout: 'withText' },
];

export function actionButton(
  props?: ActionButtonVariantProps,
): ActionButtonClasses {
  const merged = mergeVariants(
    defaultVariant,
    (props ?? {}) as Record<string, string | undefined>,
  );
  return {
    root: createClassName('seed-action-button', merged, compoundVariants),
    text: createClassName(
      'seed-action-button__text',
      merged,
      textCompoundVariants,
    ),
  };
}
