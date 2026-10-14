import * as React from "react";
import type { GestureResponderEvent, PressableProps } from "react-native";
import { Pressable, Text, View } from "react-native-css/components";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const radioVariants = cva(
  "h-5 w-5 shrink-0 flex-row items-center justify-center rounded-full border transition-colors",
  {
    variants: {
      state: {
        unchecked: "border-neutral-600",
        checked: "border-primary",
        "disabled-checked": "border-neutral-600",
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
  onCheckedChange?: (checked: boolean) => void;
  onPress?: PressableProps["onPress"];
};

function Radio({
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  label,
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

  return (
    <View
      className={cn(
        "flex-row items-center gap-2.5",
        disabled && "cursor-not-allowed",
        className,
      )}
    >
      <Pressable
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="radio"
        accessibilityState={{ checked: isChecked, disabled }}
        className={radioVariants({ disabled, state })}
        disabled={disabled}
        onPress={toggle}
      >
        {isChecked ? (
          <View
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              disabled ? "bg-neutral-600" : "bg-primary",
            )}
          />
        ) : null}
      </Pressable>
      {label ? (
        <Text
          className={cn(
            "font-p-1",
            disabled
              ? "cursor-not-allowed text-neutral-600"
              : "cursor-pointer text-black",
          )}
          onPress={toggle}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export { Radio, radioVariants };
