import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { If } from "../if";

export function Indicator({
  checked,
  variant,
  className,
}: {
  className?: string;
  variant: "radio" | "checkbox";
  checked: boolean;
}) {
  return (
    <div className={cn("p-0.5 grid place-items-center size-6", className)}>
      <div
        className={cn(
          "border border-neutral-400 data-[checked=true]:border-primary size-5 grid place-items-center",
          variant === "checkbox" &&
            "rounded-sm data-[checked=true]:bg-primary data-[checked=true]:text-neutral-0",
          variant === "radio" &&
            "rounded-full data-[checked=true]:text-primary",
        )}
        data-checked={checked}
      >
        <If condition={variant === "checkbox" && checked}>
          <CheckIcon size={16} />
        </If>
        <If condition={variant === "radio" && checked}>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="10" height="10" rx="5" fill="currentColor" />
          </svg>
        </If>
      </div>
    </div>
  );
}
