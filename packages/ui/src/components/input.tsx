import { cva } from "class-variance-authority";
import { CircleAlert, CircleX } from "lucide-react-native";
import * as React from "react";
import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native-css/components";

import { cn } from "../lib/utils";
import { Slot } from "./slot";

type InputIconProps = {
  className?: string;
  color?: string;
  size?: number;
};

export type InputProps = Omit<
  TextInputProps,
  "children" | "placeholderTextColor"
> & {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  errors?: string[];
  helper?: string[];
  variant?: "outline"; // | "ghost";
  asChild?: boolean;
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: "default" | "lg";
};

function renderIcon(
  icon: React.ReactNode,
  className?: string,
): React.ReactNode {
  if (!React.isValidElement<InputIconProps>(icon)) return icon;

  return React.cloneElement(icon, {
    className: cn(className, icon.props.className),
    color: undefined,
    size: icon.props.size ?? 24,
  });
}

const inputContainerVariants = cva(
  "group w-full rounded-lg px-3 relative isolate flex flex-col justify-end",
  {
    variants: {
      variant: {
        outline:
          "border border-neutral-300 hover:border-neutral-950 focus-within:outline-2 focus-within:outline-primary focus-within:-outline-offset-1",
      },
      size: {
        default: "h-12 py-0.5",
        lg: "h-14 py-1.5",
      },
      leading: {
        true: "pl-9",
        false: "",
      },
      trailing: {
        true: "pr-10.5",
        false: "",
      },
      error: {
        true: "pr-10.5 border-red",
        false: "",
      },
      disabled: {
        true: "border-neutral-400 focus-within:outline-none",
        false: "",
      },
    },
    compoundVariants: [{ error: true, trailing: true, class: "pr-20" }],
    defaultVariants: {
      variant: "outline",
      size: "default",
      leading: false,
      trailing: false,
      disabled: false,
    },
  },
);

const inputElementVariants = cva(
  "font-medium font-p-1 text-neutral-950 placeholder:text-neutral-300 outline-none w-full shrink-0",
  {
    variants: {
      disabled: {
        true: "text-neutral-400",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

const labelElementVariants = cva(
  "font-medium font-p-1 text-neutral-700 absolute top-1/2 -translate-y-1/2 group-focus-within:top-0 group-focus-within:translate-y-0 group-focus-within:font-p-3 group-focus-within:font-normal transition-all",
  {
    variants: {
      active: {
        true: "top-0 translate-y-0 font-p-3 font-normal",
        false: "",
      },
      disabled: {
        true: "text-neutral-400",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

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
  size = "default",
  ...props
}: InputProps) {
  const hasError = !!errors?.length;
  const labelActive =
    active || !!props.placeholder || !!props.value || !!props.defaultValue;
  const Inputcomponent = asChild ? Slot : TextInput;

  return (
    <View className={cn("grid gap-1", className)}>
      <View
        className={cn(
          inputContainerVariants({
            variant,
            size,
            disabled,
            error: hasError,
            leading: !!leadingIcon,
            trailing: !!trailingIcon,
          }),
        )}
      >
        <Text
          className={cn(
            labelElementVariants({ active: labelActive, disabled }),
          )}
          nativeID={`${id}-label`}
        >
          {label}
        </Text>
        {leadingIcon ? (
          <View className="absolute left-1.5 top-1/2 z-10 -translate-y-1/2">
            {renderIcon(
              leadingIcon,
              disabled ? "text-neutral-400" : "text-neutral-800",
            )}
          </View>
        ) : null}
        {
          <Inputcomponent
            {...props}
            accessibilityLabel={props.accessibilityLabel ?? label}
            accessibilityState={{
              ...props.accessibilityState,
              disabled: disabled,
            }}
            editable={!disabled}
            nativeID={id}
            className={cn(
              inputElementVariants({
                disabled,
              }),
            )}
            children={asChild ? children : undefined}
          />
        }
        {trailingIcon ? (
          <View
            className={cn(
              "absolute top-1/2 z-10 -translate-y-1/2",
              hasError ? "right-11" : "right-1.5",
            )}
          >
            {renderIcon(
              trailingIcon,
              disabled ? "text-neutral-400" : "text-neutral-800",
            )}
          </View>
        ) : null}
        {hasError ? (
          <View
            className={cn("absolute right-1.5 top-1/2 z-10 -translate-y-1/2")}
          >
            <CircleX
              size={24}
              className={cn(disabled ? "text-neutral-400" : "text-red")}
            />
          </View>
        ) : null}
      </View>
      {hasError ? (
        <>
          {errors?.map((error) => (
            <Text
              key={error}
              className={cn(
                "font-medium font-p2",
                disabled ? "text-neutral-400" : "text-red",
              )}
            >
              {error}
            </Text>
          ))}
        </>
      ) : null}
      {helper?.length ? (
        <>
          {helper.map((help) => (
            <View key={help} className="flex gap-1 items-start flex-row">
              <CircleAlert className="text-primary mt-0.5" size={16} />
              <Text className="font-p-2 font-normal text-neutral-800">
                {help}
              </Text>
            </View>
          ))}
        </>
      ) : null}
    </View>
  );
}

export { Input };
