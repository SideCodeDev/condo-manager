"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";
import { If } from "../if";

function Radio({
  label,
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & { label?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          "border-neutral-600 data-[state=checked]:text-primary data-[state=checked]:border-primary flex size-5 items-center justify-center rounded-full border transition-colors shrink-0 disabled:cursor-not-allowed disabled:border-neutral-400 data-[state=checked]:disabled:border-neutral-600 data-[state=checked]:disabled:text-neutral-600",
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="10" height="10" rx="5" fill="currentColor" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <If condition={!!label}>
        <label
          htmlFor={props.id}
          className="font-ui-6 text-neutral-1000 cursor-pointer data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-neutral-600"
          data-disabled={props.disabled}
        >
          {label}
        </label>
      </If>
    </div>
  );
}

export { Radio };
