import * as React from "react";
import type { GestureResponderEvent, PressableProps } from "react-native";
import { Pressable, Text, View } from "react-native-css/components";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const switchVariants = cva(
  "relative h-6 w-11 shrink-0 flex-row items-center rounded-full border border-transparent outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary",
  {
    variants: {
      checked: {
        true: "bg-primary",
        false: "bg-neutral-400",
      },
      disabled: {
        true: "cursor-not-allowed bg-neutral-600",
        false: "",
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  },
);

const switchThumbVariants = cva(
  "pointer-events-none h-5 w-5 rounded-full bg-white transition-transform",
  {
    variants: {
      checked: {
        true: "translate-x-5",
        false: "translate-x-0",
      },
      disabled: {
        true: "bg-neutral-200",
        false: "",
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  },
);

export type SwitchProps = Omit<
  PressableProps,
  "children" | "disabled" | "onPress"
> & {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: string;
  labelPosition?: "left" | "right";
  onCheckedChange?: (checked: boolean) => void;
  onPress?: PressableProps["onPress"];
};

function Switch({
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  label,
  labelPosition = "right",
  onCheckedChange,
  onPress,
  accessibilityLabel,
  ...props
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);
  const currentChecked = checked ?? uncontrolledChecked;

  const toggle = (event: GestureResponderEvent) => {
    if (disabled) return;

    const nextChecked = !currentChecked;
    if (checked === undefined) {
      setUncontrolledChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
    onPress?.(event);
  };

  const switchElement = (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="switch"
      accessibilityState={{ checked: currentChecked, disabled }}
      className={cn(
        switchVariants({ checked: currentChecked, disabled }),
        className,
      )}
      disabled={disabled}
      onPress={toggle}
    >
      <View
        className={cn(
          switchThumbVariants({ checked: currentChecked, disabled }),
        )}
      />
    </Pressable>
  );
  const labelElement = label ? (
    <Text
      className={cn(
        "font-p-1 text-black",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
      onPress={toggle}
    >
      {label}
    </Text>
  ) : null;

  return (
    <View className="flex-row items-center gap-2.5">
      {labelPosition === "left" ? labelElement : null}
      {switchElement}
      {labelPosition === "right" ? labelElement : null}
    </View>
  );
}

export { Switch, switchThumbVariants, switchVariants };
