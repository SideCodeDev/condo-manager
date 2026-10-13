import * as React from "react";
import type { TextInputProps } from "react-native";
import { TextInput, Text, View } from "react-native-css/components";
import { CircleX } from "lucide-react-native";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";
import { colors } from "../theme";

const textAreaVariants = cva(
  "w-full min-h-21.5 rounded-lg px-3 py-2 font-p-2 font-medium",
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
      resize: {
        none: "resize-none",
        both: "resize",
        horizontal: "resize-x",
        vertical: "resize-y",
      },
    },
    compoundVariants: [
      { variant: "ghost", disabled: true, class: "outline-none" },
    ],
    defaultVariants: {
      variant: "outline",
      active: false,
      error: false,
      disabled: false,
      leading: false,
      trailing: false,
      resize: "none",
    },
  },
);

type TextAreaIconProps = {
  className?: string;
  color?: string;
  size?: number;
};

export type TextAreaProps = Omit<TextInputProps, "children"> & {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  errors?: string[];
  helper?: string[];
  variant?: "ghost" | "outline";
  resize?: "none" | "both" | "horizontal" | "vertical";
  active?: boolean;
  disabled?: boolean;
  className?: string;
};

function renderIcon(
  icon: React.ReactNode,
  disabled: boolean,
  className?: string,
): React.ReactNode {
  if (!React.isValidElement<TextAreaIconProps>(icon)) return icon;

  return React.cloneElement(icon, {
    className: cn(className, icon.props.className),
    color: disabled
      ? colors.neutral[400]
      : (icon.props.color ?? colors.neutral[600]),
    size: icon.props.size ?? 20,
  });
}

function TextArea({
  active = false,
  className,
  disabled = false,
  errors,
  helper,
  id,
  label,
  leadingIcon,
  placeholderTextColor,
  resize = "none",
  trailingIcon,
  variant = "outline",
  ...props
}: TextAreaProps) {
  const hasError = Boolean(errors?.length);
  const isDisabled = disabled || props.editable === false;
  const inputClassName = textAreaVariants({
    active,
    disabled: isDisabled,
    error: hasError,
    leading: Boolean(leadingIcon),
    resize,
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
    multiline: true,
    nativeID: id,
    placeholderTextColor: placeholderTextColor ?? colors.neutral[300],
    textAlignVertical: "top" as const,
  };

  return (
    <View className={cn("gap-1 font-p-2 text-neutral-950", className)}>
      {variant === "outline" ? (
        <Text className="font-p-2" nativeID={`${id}-label`}>
          {label}
        </Text>
      ) : null}
      <View className="relative">
        {leadingIcon ? (
          <View className="absolute left-3 top-2 z-10">
            {renderIcon(
              leadingIcon,
              isDisabled,
              isDisabled ? "text-neutral-400" : "text-neutral-600",
            )}
          </View>
        ) : null}
        <TextInput {...inputProps} className={inputClassName} />
        {trailingIcon ? (
          <View className="absolute right-3 top-2 z-10">
            {renderIcon(
              trailingIcon,
              isDisabled,
              isDisabled ? "text-neutral-400" : "text-neutral-600",
            )}
          </View>
        ) : null}
      </View>
      {hasError ? (
        <View className="gap-1">
          {errors?.map((error) => (
            <View className="flex-row items-center gap-1" key={error}>
              <CircleX color={colors.red.DEFAULT} size={16} />
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

export { TextArea, textAreaVariants };
