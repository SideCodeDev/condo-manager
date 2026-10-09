"use client";

import { cn } from "../lib/utils";
import { ButtonHTMLAttributes } from "react";
import { If } from "./if";
import { Slot } from "radix-ui";
import { Indicator } from "./indicator";

export function SelectorList({
  checked,
  label,
  onChange,
  variant,
  className,
  subLabel,
  onClick,
  type = "button",
  asChild,
  ...props
}: {
  variant: "checkbox" | "radio";
  checked: boolean;
  label: string;
  subLabel?: string;
  asChild?: boolean;
  onChange: (checked: boolean) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "disabled">) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      onClick={(ev) => {
        onChange(!checked);
        onClick?.(ev);
      }}
      data-checked={checked}
      type={type}
      className={cn(
        "border border-neutral-400 p-3 rounded-lg gap-2 outline-none flex *:shrink-0 transition-colors",
        "hover:bg-neutral-100 focus-visible:bg-neutral-100",
        "data-[checked=true]:border-primary data-[checked=true]:bg-primary-200 data-[checked=true]:hover:bg-primary-200/50 data-[checked=true]:focus-visible:bg-primary-200/50",
        className,
      )}
      {...props}
    >
      <Indicator checked={checked} variant={variant} />
      <div className="grid gap-1">
        <span className="font-p-2 font-medium text-neutral-1000 text-start">
          {label}
        </span>
        <If condition={!!subLabel}>
          <span className="font-ui-7 font-light text-neutral-1000 text-start">
            {subLabel}
          </span>
        </If>
      </div>
    </Comp>
  );
}
