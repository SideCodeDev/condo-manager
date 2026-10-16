import * as React from "react";
import { cva } from "class-variance-authority";
import type { GestureResponderEvent, PressableProps } from "react-native";
import { Pressable, Text, View } from "react-native-css/components";
import { Check, Minus } from "lucide-react-native";

import { cn } from "../lib/utils";

type CheckboxState = boolean | "indeterminate";

const checkboxVariants = cva(
  "h-5 w-5 shrink-0 flex-row items-center justify-center rounded-xs border transition-colors",
  {
    variants: {
      state: {
        unchecked: "border-neutral-600",
        checked: "border-primary bg-primary text-white",
        indeterminate: "border-primary bg-primary text-white",
        "disabled-checked": "border-neutral-600 bg-neutral-600 text-white",
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

export type CheckboxProps = Omit<
  PressableProps,
  "children" | "onPress" | "disabled"
> & {
  checked?: CheckboxState;
  className?: string;
  defaultChecked?: CheckboxState;
  disabled?: boolean;
  id?: string;
  label?: string;
  labelPosition?: "left" | "right";
  onCheckedChange?: (checked: CheckboxState) => void;
  onPress?: PressableProps["onPress"];
};

function Checkbox({
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
}: CheckboxProps) {
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState<CheckboxState>(defaultChecked);
  const currentChecked = checked ?? uncontrolledChecked;
  const isIndeterminate = currentChecked === "indeterminate";
  const isChecked = currentChecked === true;
  const state = disabled
    ? isIndeterminate || isChecked
      ? "disabled-checked"
      : "unchecked"
    : isIndeterminate
      ? "indeterminate"
      : isChecked
        ? "checked"
        : "unchecked";

  const toggle = (event?: GestureResponderEvent) => {
    if (disabled) return;

    const nextChecked = isChecked || isIndeterminate ? false : true;
    if (checked === undefined) {
      setUncontrolledChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
    if (event) onPress?.(event);
  };

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
    <View className={cn("flex-row items-center gap-2", className)}>
      {labelPosition === "left" ? labelElement : null}
      <Pressable
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: isIndeterminate ? "mixed" : isChecked,
          disabled,
        }}
        className={cn(checkboxVariants({ disabled, state }))}
        disabled={disabled}
        onPress={toggle}
      >
        {isIndeterminate ? (
          <Minus
            className={disabled ? "text-neutral-200" : "text-white"}
            size={16}
            strokeWidth={2}
          />
        ) : isChecked ? (
          <Check
            className={disabled ? "text-neutral-200" : "text-white"}
            size={16}
            strokeWidth={2}
          />
        ) : null}
      </Pressable>
      {labelPosition === "right" ? labelElement : null}
    </View>
  );
}

export { Checkbox, checkboxVariants };
