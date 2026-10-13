import * as React from "react";
import { cva } from "class-variance-authority";
import type { GestureResponderEvent, PressableProps } from "react-native";
import { Pressable, Text, View } from "react-native-css/components";

import { Indicator } from "./indicator";
import { getSlotChild, Slot } from "./slot";

const selectorListVariants = cva(
  "flex-row shrink-0 gap-2 rounded-lg border border-neutral-400 p-3 outline-none transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100",
  {
    variants: {
      checked: {
        true: "border-primary bg-primary-200 hover:bg-primary-200/50 focus-visible:bg-primary-200/50",
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  },
);

export type SelectorListProps = Omit<
  PressableProps,
  "children" | "onPress" | "disabled"
> & {
  asChild?: boolean;
  checked: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  onPress?: PressableProps["onPress"];
  subLabel?: string;
  variant: "checkbox" | "radio";
};

function SelectorList({
  asChild = false,
  checked,
  children,
  className,
  disabled = false,
  label,
  onChange,
  onPress,
  subLabel,
  variant,
  ...props
}: SelectorListProps) {
  const buttonClassName = selectorListVariants({ checked, className, disabled });

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;
    onChange(!checked);
    onPress?.(event);
  };

  const content = (
    <>
      <Indicator checked={checked} variant={variant} />
      <View className="shrink-0 gap-1">
        <Text className="font-p-2 font-medium text-neutral-1000 text-start">
          {label}
        </Text>
        {subLabel ? (
          <Text className="font-ui-7 font-light text-neutral-1000 text-start">
            {subLabel}
          </Text>
        ) : null}
      </View>
    </>
  );

  if (asChild && children) {
    const child = getSlotChild(children) as React.ReactElement<{
      children?: React.ReactNode;
    }>;

    return (
      <Slot
        {...props}
        className={buttonClassName}
        disabled={disabled}
        onPress={handlePress}
      >
        {React.cloneElement(child, { children: content })}
      </Slot>
    );
  }

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: checked }}
      className={buttonClassName}
      disabled={disabled}
      onPress={handlePress}
    >
      {content}
    </Pressable>
  );
}

export { SelectorList, selectorListVariants };
