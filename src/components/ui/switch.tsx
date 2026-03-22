import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-neutral-300 focus-visible:border-primary focus-visible:ring-primary aria-invalid:ring-red aria-invalid:border-red shrink-0 rounded-full border border-transparent focus-visible:ring-3 aria-invalid:ring-3 h-6 w-11 peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-[state=unchecked]:disabled:cursor-not-allowed data-[state=checked]:disabled:cursor-not-allowed data-[state=unchecked]:disabled:bg-neutral-600 data-[state=checked]:disabled:bg-neutral-600",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        data-disabled={props.disabled}
        className="bg-neutral-0 rounded-full size-5 data-[state=checked]:translate-x-full data-[state=unchecked]:translate-x-0 pointer-events-none block ring-0 transition-transform data-[disabled=true]:bg-neutral-400"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
