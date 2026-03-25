import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";
import { ButtonHTMLAttributes } from "react";

export function Tag({
  selected,
  asChild,
  className,
  type = "button",
  ...props
}: {
  selected?: boolean;
  asChild?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled">) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      {...props}
      type={type}
      data-selected={selected}
      className={cn(
        "transition-colors p-3 rounded-lg inline-flex items-center gap-2 text-neutral-1000 font-semibold font-ui-7 [&_svg:not([class*='size-'])]:size-5 bg-neutral-100 hover:bg-neutral-200 focus-visible:bg-neutral-200",
        "data-[selected=true]:bg-primary data-[selected=true]:text-neutral-0",
        "data-[selected=true]:hover:bg-primary-200 data-[selected=true]:hover:text-neutral-1000",
        "data-[selected=true]:focus-visible:bg-primary-200 data-[selected=true]:focus-visible:text-neutral-1000",
        className,
      )}
    />
  );
}
