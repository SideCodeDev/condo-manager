import * as React from "react";
import type { GestureResponderEvent, PressableProps } from "react-native";
import { Pressable, Text, View } from "react-native-css/components";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const radioVariants = cva(
  "h-6 w-6 shrink-0 flex-row items-center justify-center rounded-full border-2 transition-colors",
  {
    variants: {
      state: {
        unchecked: "border-neutral-900",
        checked: "border-primary",
        "disabled-checked": "border-neutral-400",
      },
      disabled: {
        true: "cursor-not-allowed border-neutral-400",
        false: "",
      },
    },
    defaultVariants: {
      state: "unchecked",
      disabled: false,
    },
  },
);

export type RadioProps = Omit<
  PressableProps,
  "children" | "onPress" | "disabled"
> & {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  labelPosition?: "left" | "right";
  onCheckedChange?: (checked: boolean) => void;
  onPress?: PressableProps["onPress"];
};

function Radio({
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
}: RadioProps) {
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);
  const isChecked = checked ?? uncontrolledChecked;
  const state = disabled
    ? isChecked
      ? "disabled-checked"
      : "unchecked"
    : isChecked
      ? "checked"
      : "unchecked";

  const toggle = (event?: GestureResponderEvent) => {
    if (disabled) return;

    const nextChecked = !isChecked;
    if (checked === undefined) {
      setUncontrolledChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
    if (event) onPress?.(event);
  };

  const labelElement = label ? (
    <Text
      className={cn(
        "font-p-1",
        disabled
          ? "cursor-not-allowed text-neutral-400"
          : "cursor-pointer text-black",
      )}
      onPress={toggle}
    >
      {label}
    </Text>
  ) : null;

  return (
    <View
      className={cn(
        "flex-row items-center gap-2",
        disabled && "cursor-not-allowed",
        className,
      )}
    >
      {labelPosition === "left" ? labelElement : null}
      <Pressable
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="radio"
        accessibilityState={{ checked: isChecked, disabled }}
        className={cn(radioVariants({ disabled, state }))}
        disabled={disabled}
        onPress={toggle}
      >
        {isChecked ? (
          <View
            className={cn(
              "h-3.5 w-3.5 rounded-full",
              disabled ? "bg-neutral-400" : "bg-primary",
            )}
          />
        ) : null}
      </Pressable>
      {labelPosition === "right" ? labelElement : null}
    </View>
  );
}

export { Radio, radioVariants };
