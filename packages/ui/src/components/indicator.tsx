import { Check } from "lucide-react-native";
import { cva } from "class-variance-authority";
import { View } from "react-native-css/components";

import { cn } from "../lib/utils";

const indicatorVariants = cva(
  "h-6 w-6 p-0.5 flex-row items-center justify-center",
  {
    variants: {
      variant: {
        checkbox: "",
        radio: "",
      },
    },
    defaultVariants: {
      variant: "checkbox",
    },
  },
);

const indicatorControlVariants = cva(
  "h-6 w-6 flex-row items-center justify-center border-2 border-neutral-900",
  {
    variants: {
      variant: {
        checkbox: "rounded-sm",
        radio: "rounded-full",
      },
      checked: {
        true: "border-primary",
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "checkbox",
        checked: true,
        class: "bg-primary text-white",
      },
      {
        variant: "radio",
        checked: true,
        class: "text-primary",
      },
      {
        variant: "checkbox",
        disabled: true,
        checked: false,
        class: "border-neutral-200",
      },
      {
        variant: "checkbox",
        disabled: true,
        checked: true,
        class: "border-neutral-200 bg-neutral-200",
      },
      {
        variant: "radio",
        disabled: true,
        checked: false,
        class: "border-neutral-400",
      },
      {
        variant: "radio",
        disabled: true,
        checked: true,
        class: "border-neutral-400",
      },
    ],
    defaultVariants: {
      variant: "checkbox",
      checked: false,
      disabled: false,
    },
  },
);

export type IndicatorProps = {
  checked: boolean;
  className?: string;
  disabled?: boolean;
  variant: "radio" | "checkbox";
};

function Indicator({
  checked,
  className,
  disabled = false,
  variant,
}: IndicatorProps) {
  return (
    <View className={cn(indicatorVariants({ variant }), className)}>
      <View
        className={cn(indicatorControlVariants({ checked, disabled, variant }))}
      >
        {variant === "checkbox" && checked ? (
          <Check className="text-white" size={24} strokeWidth={2} />
        ) : null}
        {variant === "radio" && checked ? (
          <View
            className={cn(
              "h-3.5 w-3.5 rounded-full",
              disabled ? "bg-neutral-600" : "bg-primary",
            )}
          />
        ) : null}
      </View>
    </View>
  );
}

export { Indicator, indicatorVariants };
