import * as React from "react";
import { cva } from "class-variance-authority";
import type { GestureResponderEvent, PressableProps } from "react-native";
import { Pressable, Text, View } from "react-native-css/components";
import { Check, Minus } from "lucide-react-native";

import { cn } from "../lib/utils";

type CheckboxState = boolean | "indeterminate";

const checkboxVariants = cva(
  "h-5 w-5 shrink-0 flex-row items-center justify-center rounded-[2px] border transition-colors",
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
  onCheckedChange?: (checked: CheckboxState) => void;
  onPress?: PressableProps["onPress"];
};

function Checkbox({
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  label,
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

  return (
    <View className={cn("flex-row items-center gap-2.5", className)}>
      <Pressable
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: isIndeterminate ? "mixed" : isChecked,
          disabled,
        }}
        className={checkboxVariants({ disabled, state })}
        disabled={disabled}
        onPress={toggle}
      >
        {isIndeterminate ? (
          <Minus className="text-white" size={16} strokeWidth={2} />
        ) : isChecked ? (
          <Check className="text-white" size={16} strokeWidth={2} />
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

export { Checkbox, checkboxVariants };
