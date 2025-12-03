// src/components/ui/button.tsx
"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "./utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium rounded-full transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "shadow-sm",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-indigo-600 to-purple-600 text-white " +
          "hover:from-indigo-700 hover:to-purple-700",
        secondary:
          "bg-white text-slate-800 border border-slate-200 " +
          "hover:bg-slate-50",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
        link: "bg-transparent text-indigo-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-5 py-3",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
