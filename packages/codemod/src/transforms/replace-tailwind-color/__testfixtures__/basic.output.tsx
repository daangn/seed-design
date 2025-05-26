// @ts-nocheck

export function BackgroundExample() {
  return (
    <div>
      <div className="bg-bg-brand-solid">Primary Background</div>
      <div className="bg-palette-carrot-100">Primary Low Background</div>
      <div className="hover:bg-palette-carrot-100">Hover Primary Low Background</div>
      <div className="focus:bg-palette-carrot-100">Focus Primary Low Background</div>
      <div className="active:bg-palette-carrot-100">Active Primary Low Background</div>
      <div className="bg-palette-gray-600">Scale Background</div>
      <div className="bg-palette-carrot-200">Scale Carrot Low Background</div>
      <div className="bg-palette-carrot-300">Scale Carrot Mid Background</div>
      <div className="bg-palette-carrot-400">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-500">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-600">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-600">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-700">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-700">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-800">Scale Carrot High Background</div>
      <div className="!bg-palette-carrot-800">Scale Carrot High Background</div>
      <div className="bg-palette-static-black">Static Black Background</div>
      <div className="bg-palette-static-white">Static White Background</div>
      <div className="bg-palette-static-black">Static Gray900 Background</div>
    </div>
  );
}

export function SeedBackgroundExample() {
  return (
    <div>
      <div className="bg-bg-brand-solid">Primary Background</div>
      <div className="bg-palette-carrot-100">Primary Low Background</div>
      <div className="hover:bg-palette-carrot-100">Hover Primary Low Background</div>
      <div className="focus:bg-palette-carrot-100">Focus Primary Low Background</div>
      <div className="active:bg-palette-carrot-100">Active Primary Low Background</div>
      <div className="bg-palette-gray-600">Scale Background</div>
      <div className="bg-palette-carrot-200">Scale Carrot Low Background</div>
      <div className="bg-palette-carrot-300">Scale Carrot Mid Background</div>
      <div className="bg-palette-carrot-400">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-500">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-600">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-600">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-700">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-700">Scale Carrot High Background</div>
      <div className="bg-palette-carrot-800">Scale Carrot High Background</div>
      <div className="!bg-palette-carrot-800">Scale Carrot High Background</div>
      <div className="bg-palette-static-black">Static Black Background</div>
      <div className="bg-palette-static-white">Static White Background</div>
      <div className="bg-palette-static-black">Static Gray900 Background</div>
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
        default: "bg-bg-brand-solid text-palette-static-white hover:bg-palette-carrot-100",
        destructive: "bg-bg-critical-solid text-palette-static-white hover:bg-bg-critical-weak",
        outline: "border border-palette-gray-400 bg-palette-static-white text-palette-gray-1000 hover:bg-palette-gray-200",
        secondary: "bg-bg-neutral-weak text-palette-gray-900 hover:bg-palette-gray-300",
        ghost: "text-fg-brand hover:bg-palette-carrot-100",
        link: "text-fg-brand underline-offset-4 hover:underline",
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
