import { Check } from "lucide-react-native";
import { cva } from "class-variance-authority";
import { View } from "react-native-css/components";

import { cn } from "../lib/utils";

const indicatorVariants = cva("h-6 w-6 p-0.5 flex-row items-center justify-center", {
  variants: {
    variant: {
      checkbox: "",
      radio: "",
    },
  },
  defaultVariants: {
    variant: "checkbox",
  },
});

const indicatorControlVariants = cva(
  "h-5 w-5 flex-row items-center justify-center border border-neutral-400",
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
    ],
    defaultVariants: {
      variant: "checkbox",
      checked: false,
    },
  },
);

export type IndicatorProps = {
  checked: boolean;
  className?: string;
  variant: "radio" | "checkbox";
};

function Indicator({ checked, variant, className }: IndicatorProps) {
  return (
    <View className={cn(indicatorVariants({ variant }), className)}>
      <View className={indicatorControlVariants({ checked, variant })}>
        {variant === "checkbox" && checked ? (
          <Check className="text-white" size={16} strokeWidth={2} />
        ) : null}
        {variant === "radio" && checked ? (
          <View className="h-2.5 w-2.5 rounded-full bg-primary" />
        ) : null}
      </View>
    </View>
  );
}

export { Indicator, indicatorVariants };
