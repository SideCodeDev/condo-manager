import * as React from "react";
import type { GestureResponderEvent, PressableProps } from "react-native";
import { Pressable, View } from "react-native-css/components";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const switchVariants = cva(
  "relative h-6 w-11 shrink-0 flex-row items-center rounded-full border border-transparent outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary",
  {
    variants: {
      checked: {
        true: "bg-primary",
        false: "bg-neutral-300",
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
        true: "bg-neutral-400",
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
  onCheckedChange?: (checked: boolean) => void;
  onPress?: PressableProps["onPress"];
};

function Switch({
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  onCheckedChange,
  onPress,
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

  return (
    <Pressable
      {...props}
      accessibilityRole="switch"
      accessibilityState={{ checked: currentChecked, disabled }}
      className={cn(switchVariants({ checked: currentChecked, disabled }), className)}
      disabled={disabled}
      onPress={toggle}
    >
      <View
        className={switchThumbVariants({ checked: currentChecked, disabled })}
      />
    </Pressable>
  );
}

export { Switch, switchThumbVariants, switchVariants };
