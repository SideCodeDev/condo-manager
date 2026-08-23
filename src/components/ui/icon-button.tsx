import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader } from "./loader";

const buttonVariants = cva(
  "border border-neutral-200 grid place-items-center bg-neutral-0 text-neutral-1000 hover:bg-neutral-100 focus-visible:bg-neutral-100",
  {
    variants: {
      size: {
        large: "size-10 [&_svg:not([class*='size-'])]:size-6",
        small: "size-8 [&_svg:not([class*='size-'])]:size-5",
      },
      variant: {
        round: "rounded-full",
        square: "rounded-xl",
      },
    },
    defaultVariants: {
      size: "large",
      variant: "round",
    },
  },
);

export function IconButton({
  className,
  variant = "round",
  size = "large",
  asChild = false,
  loading,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild && !loading ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
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
