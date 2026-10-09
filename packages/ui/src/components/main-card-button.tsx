"use client";

import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

function MainCardButton({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        "[&_svg:not([class*='size-'])]:size-8 pl-4 pr-11 py-5 rounded-xl border border-neutral-100 bg-neutral-0 font-ui-6 font-semibold text-neutral-1000 grid gap-3",
        "transition hover:bg-neutral-50 focus-visible:bg-neutral-50 hover:shadow-2 focus-visible:shadow-2 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { MainCardButton };
