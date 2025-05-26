// @ts-nocheck

export function BackgroundExample() {
  return (
    <div>
      <div className="bg-primary">Primary Background</div>
      <div className="bg-primaryLow">Primary Low Background</div>
      <div className="hover:bg-primaryLow">Hover Primary Low Background</div>
      <div className="focus:bg-primaryLow">Focus Primary Low Background</div>
      <div className="active:bg-primaryLow">Active Primary Low Background</div>
      <div className="bg-gray500">Scale Background</div>
      <div className="bg-carrot100">Scale Carrot Low Background</div>
      <div className="bg-carrot200">Scale Carrot Mid Background</div>
      <div className="bg-carrot300">Scale Carrot High Background</div>
      <div className="bg-carrot400">Scale Carrot High Background</div>
      <div className="bg-carrot500">Scale Carrot High Background</div>
      <div className="bg-carrot600">Scale Carrot High Background</div>
      <div className="bg-carrot700">Scale Carrot High Background</div>
      <div className="bg-carrot800">Scale Carrot High Background</div>
      <div className="bg-carrot900">Scale Carrot High Background</div>
      <div className="!bg-carrot900">Scale Carrot High Background</div>
      <div className="bg-staticBlack">Static Black Background</div>
      <div className="bg-staticWhite">Static White Background</div>
      <div className="bg-staticGray900">Static Gray900 Background</div>
    </div>
  );
}

export function SeedBackgroundExample() {
  return (
    <div>
      <div className="bg-seed-primary">Primary Background</div>
      <div className="bg-seed-primaryLow">Primary Low Background</div>
      <div className="hover:bg-seed-primaryLow">Hover Primary Low Background</div>
      <div className="focus:bg-seed-primaryLow">Focus Primary Low Background</div>
      <div className="active:bg-seed-primaryLow">Active Primary Low Background</div>
      <div className="bg-seed-gray500">Scale Background</div>
      <div className="bg-seed-carrot100">Scale Carrot Low Background</div>
      <div className="bg-seed-carrot200">Scale Carrot Mid Background</div>
      <div className="bg-seed-carrot300">Scale Carrot High Background</div>
      <div className="bg-seed-carrot400">Scale Carrot High Background</div>
      <div className="bg-seed-carrot500">Scale Carrot High Background</div>
      <div className="bg-seed-carrot600">Scale Carrot High Background</div>
      <div className="bg-seed-carrot700">Scale Carrot High Background</div>
      <div className="bg-seed-carrot800">Scale Carrot High Background</div>
      <div className="bg-seed-carrot900">Scale Carrot High Background</div>
      <div className="!bg-seed-carrot900">Scale Carrot High Background</div>
      <div className="bg-seed-staticBlack">Static Black Background</div>
      <div className="bg-seed-staticWhite">Static White Background</div>
      <div className="bg-seed-staticGray900">Static Gray900 Background</div>
    </div>
  );
}

// Class Variance Authority Example
import { cva } from "class-variance-authority";

// Button component with variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-staticWhite hover:bg-primaryLow",
        destructive: "bg-danger text-staticWhite hover:bg-dangerLow",
        outline: "border border-gray300 bg-staticWhite text-gray900 hover:bg-gray100",
        secondary: "bg-seed-secondaryLow text-seed-secondary hover:bg-seed-gray200",
        ghost: "text-seed-primary hover:bg-seed-primaryLow",
        link: "text-seed-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
