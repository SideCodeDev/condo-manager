"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { If } from "../if";

function Checkbox({
  label,
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & { label?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          "border-neutral-600 data-[state=checked]:bg-primary data-[state=checked]:text-neutral-0 data-[state=checked]:border-primary flex size-5 items-center justify-center rounded-xs border transition-colors shrink-0 disabled:cursor-not-allowed disabled:border-neutral-400 data-[state=checked]:disabled:border-neutral-600 data-[state=checked]:disabled:bg-neutral-600",
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="[&>svg]:size-4 grid place-content-center text-current transition-none"
        >
          <CheckIcon />
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

export { Checkbox };
