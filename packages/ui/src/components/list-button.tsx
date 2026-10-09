"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center outline-none gap-2 whitespace-nowrap rounded text-neutral-1000 font-ui-6 transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 shrink-0 [&_svg]:shrink-0 hover:bg-neutral-100 focus-visible:bg-neutral-100",
  {
    variants: {
      variant: {
        standalone: "py-3 px-4",
        dropdown:
          "p-3 font-semibold data-[selected=true]:bg-primary-200 data-[selected=true]:ring data-[selected=true]:ring-primary data-[selected=true]:hover:bg-primary-200 data-[selected=true]:focus-visible:bg-primary-200",
      },
    },
    defaultVariants: {
      variant: "standalone",
    },
  },
);

function ListButton({
  className,
  variant = "standalone",
  asChild = false,
  selected = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    selected?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-selected={selected}
      data-variant={variant}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { buttonVariants, ListButton };
