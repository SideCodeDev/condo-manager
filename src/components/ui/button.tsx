import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { Loader } from "./loader";

const buttonVariants = cva(
  "inline-flex min-w-36 items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: [
          "bg-neutral-950 text-neutral-0 focus-visible:bg-neutral-800 hover:bg-neutral-800 disabled:bg-neutral-700 disabled:text-neutral-300",
          "data-destructive:bg-red data-destructive:focus-visible:bg-red-600 data-destructive:hover:bg-red-600",
        ].join(" "),
        secondary: [
          "text-neutral-950 border border-neutral-950 focus-visible:text-neutral-800 focus-visible:border-neutral-800 hover:text-neutral-800 hover:border-neutral-800 disabled:text-neutral-600 disabled:border-neutral-600",
          "data-destructive:border-red data-destructive:text-red data-destructive:focus-visible:border-red-600 data-destructive:focus-visible:text-red-600 data-destructive:hover:border-red-600 data-destructive:hover:text-red-600",
        ].join(" "),
        link: [
          "underline text-neutral-950 focus-visible:text-neutral-800 hover:text-neutral-800 disabled:text-neutral-600",
          "data-destructive:text-red data-destructive:focus-visible:text-red-600 data-destructive:hover:text-red-600",
        ].join(" "),
        ghost: [
          "text-primary focus-visible:text-primary-900 hover:text-primary-900 disabled:text-neutral-600",
          "data-destructive:text-red data-destructive:focus-visible:text-red-600 data-destructive:hover:text-red-600",
        ].join(" "),
      },
      size: {
        standard: "font-ui-6 px-3 py-2.5",
        sm: "font-ui-7 px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "standard",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "standard",
  asChild = false,
  loading,
  destructive = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    destructive?: boolean;
  }) {
  const Comp = asChild && !loading ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-destructive={destructive || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
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

export { Button, buttonVariants };
