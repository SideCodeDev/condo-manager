"use client";

import { cn } from "../lib/utils";
import { Slot } from "radix-ui";
import { Loader } from "./loader";

export function GlassButton({
  className,
  asChild = false,
  loading,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  loading?: boolean;
}) {
  const Comp = asChild && !loading ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(
        "[&_svg:not([class*='size-'])]:size-5 items-center inline-flex transition-all gap-2 rounded-full px-2 py-1 bg-neutral-0/1 text-neutral-0 shadow-glass focus-visible:shadow-glass-focus hover:shadow-glass-focus focus-visible:outline-none",
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader aria-hidden="true" />
          <span className="sr-only">{children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}
