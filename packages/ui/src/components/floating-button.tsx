"use client";

import { Slot } from "radix-ui";
import { Loader } from "./loader";
import { cn } from "../lib/utils";

type FloatingButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  loading?: boolean;
};
export function FloatingButton({
  asChild,
  loading,
  children,
  className,
  ...props
}: FloatingButtonProps) {
  const Comp = asChild && !loading ? Slot.Root : "button";
  return (
    <Comp
      className={cn(
        "p-3 [&_svg:not([class*='size-'])]:size-8 inline-flex min-w-14 h-14 items-center gap-2 text-neutral-0 shadow-floating rounded-full bg-primary hover:bg-primary-900 focus-visible:bg-primary-900 font-ui-6 font-semibold",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader size={24} aria-hidden="true" />
          <span className="sr-only">{children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}
