import * as React from "react";
import type { TextInputProps } from "react-native";
import { TextInput, Text, View } from "react-native-css/components";
import { CircleX } from "lucide-react-native";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";
import { Slot } from "./slot";

const inputVariants = cva(
  "w-full rounded-lg px-3 py-2 font-p-2 font-medium",
  {
    variants: {
      variant: {
        outline:
          "outline outline-neutral-600 focus-visible:outline-2 hover:outline-2",
        ghost: "focus-visible:outline-2 focus-visible:outline-primary",
      },
      active: {
        true: "outline-2",
        false: "",
      },
      error: {
        true: "outline-red",
        false: "",
      },
      disabled: {
        true: "bg-neutral-100 outline-neutral-500 outline-1 text-neutral-400 placeholder:text-neutral-300",
        false: "text-neutral-950 placeholder:text-neutral-300",
      },
      leading: {
        true: "pl-11",
        false: "",
      },
      trailing: {
        true: "pr-11",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "ghost", active: true, class: "outline-primary" },
      { variant: "ghost", disabled: true, class: "outline-none" },
    ],
    defaultVariants: {
      variant: "outline",
      active: false,
      error: false,
      disabled: false,
      leading: false,
      trailing: false,
    },
  },
);

type InputIconProps = {
  className?: string;
  color?: string;
  size?: number;
};

export type InputProps = Omit<TextInputProps, "children" | "placeholderTextColor"> & {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  errors?: string[];
  helper?: string[];
  variant?: "ghost" | "outline";
  asChild?: boolean;
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

function renderIcon(
  icon: React.ReactNode,
  className?: string,
): React.ReactNode {
  if (!React.isValidElement<InputIconProps>(icon)) return icon;

  return React.cloneElement(icon, {
    className: cn(className, icon.props.className),
    color: undefined,
    size: icon.props.size ?? 20,
  });
}

function Input({
  active = false,
  asChild = false,
  children,
  className,
  disabled = false,
  errors,
  helper,
  id,
  label,
  leadingIcon,
  trailingIcon,
  variant = "outline",
  ...props
}: InputProps) {
  const hasError = Boolean(errors?.length);
  const isDisabled = disabled || props.editable === false;
  const iconClassName = isDisabled ? "text-neutral-400" : "text-neutral-600";
  const inputClassName = inputVariants({
    active,
    disabled: isDisabled,
    error: hasError,
    leading: Boolean(leadingIcon),
    trailing: Boolean(trailingIcon),
    variant,
  });
  const inputProps = {
    ...props,
    accessibilityLabel: props.accessibilityLabel ?? label,
    accessibilityState: {
      ...props.accessibilityState,
      disabled: isDisabled,
    },
    editable: isDisabled ? false : props.editable,
    nativeID: id,
  };

  const input = asChild ? (
    <Slot {...inputProps} className={inputClassName}>
      {children}
    </Slot>
  ) : (
    <TextInput {...inputProps} className={inputClassName} />
  );

  return (
    <View className={cn("gap-1 font-p-2 text-neutral-950", className)}>
      {variant === "outline" ? (
        <Text className="font-p-2" nativeID={`${id}-label`}>
          {label}
        </Text>
      ) : null}
      <View className="relative">
        {leadingIcon ? (
          <View className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
            {renderIcon(leadingIcon, iconClassName)}
          </View>
        ) : null}
        {input}
        {trailingIcon ? (
          <View className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
            {renderIcon(trailingIcon, iconClassName)}
          </View>
        ) : null}
      </View>
      {hasError ? (
        <View className="gap-1">
          {errors?.map((error) => (
            <View className="flex-row items-center gap-1" key={error}>
              <CircleX className="text-red" size={16} />
              <Text className="font-p-3 text-red">{error}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {helper?.length ? (
        <View className="gap-1">
          {helper.map((help) => (
            <Text className="font-p-3 text-neutral-600" key={help}>
              {help}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export { Input, inputVariants };
