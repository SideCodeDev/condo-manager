import * as React from "react";
import type { TextInputProps } from "react-native";
import { TextInput, Text, View } from "react-native-css/components";
import { CircleAlert, CircleX } from "lucide-react-native";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";
import { If } from "./if";

type TextAreaIconProps = {
  className?: string;
  color?: string;
  size?: number;
};

export type TextAreaProps = Omit<
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
  resize?: "none" | "both" | "horizontal" | "vertical";
  active?: boolean;
  disabled?: boolean;
  className?: string;
};

function renderIcon(
  icon: React.ReactNode,
  className?: string,
): React.ReactNode {
  if (!React.isValidElement<TextAreaIconProps>(icon)) return icon;

  return React.cloneElement(icon, {
    className: cn(className, icon.props.className),
    color: undefined,
    size: icon.props.size ?? 24,
  });
}

// function TextArea2({
//   active = false,
//   className,
//   disabled = false,
//   errors,
//   helper,
//   id,
//   label,
//   leadingIcon,
//   resize = "none",
//   trailingIcon,
//   variant = "outline",
//   ...props
// }: TextAreaProps) {
//   const hasError = Boolean(errors?.length);
//   const isDisabled = disabled || props.editable === false;
//   const inputClassName = textAreaVariants({
//     active,
//     disabled: isDisabled,
//     error: hasError,
//     leading: Boolean(leadingIcon),
//     resize,
//     trailing: Boolean(trailingIcon),
//     variant,
//   });
//   const inputProps = {
//     ...props,
//     accessibilityLabel: props.accessibilityLabel ?? label,
//     accessibilityState: {
//       ...props.accessibilityState,
//       disabled: isDisabled,
//     },
//     editable: isDisabled ? false : props.editable,
//     multiline: true,
//     nativeID: id,
//     textAlignVertical: "top" as const,
//   };

//   return (
//     <View className={cn("gap-1 font-p-2 text-neutral-950", className)}>
//       {variant === "outline" ? (
//         <Text className="font-p-2" nativeID={`${id}-label`}>
//           {label}
//         </Text>
//       ) : null}
//       <View className="relative">
//         {leadingIcon ? (
//           <View className="absolute left-3 top-2 z-10">
//             {renderIcon(
//               leadingIcon,
//               isDisabled ? "text-neutral-400" : "text-neutral-600",
//             )}
//           </View>
//         ) : null}
//         <TextInput {...inputProps} className={inputClassName} />
//         {trailingIcon ? (
//           <View className="absolute right-3 top-2 z-10">
//             {renderIcon(
//               trailingIcon,
//               isDisabled ? "text-neutral-400" : "text-neutral-600",
//             )}
//           </View>
//         ) : null}
//       </View>
//       {hasError ? (
//         <View className="gap-1">
//           {errors?.map((error) => (
//             <View className="flex-row items-center gap-1" key={error}>
//               <CircleX className="text-red" size={16} />
//               <Text className="font-p-3 text-red">{error}</Text>
//             </View>
//           ))}
//         </View>
//       ) : null}
//       {helper?.length ? (
//         <View className="gap-1">
//           {helper.map((help) => (
//             <Text className="font-p-3 text-neutral-600" key={help}>
//               {help}
//             </Text>
//           ))}
//         </View>
//       ) : null}
//     </View>
//   );
// }

const textareaContainerVariants = cva(
  "group w-full min-h-35 rounded-lg px-3 pb-1.5 pt-6.5 relative isolate flex flex-col",
  {
    variants: {
      variant: {
        outline: "border border-neutral-300",
      },
      leading: {
        true: "pl-9",
        false: "",
      },
      trailing: {
        true: "pr-10.5",
        false: "",
      },
      resize: {
        none: "resize-none",
        both: "resize overflow-auto",
        horizontal: "resize-x overflow-auto",
        vertical: "resize-y overflow-auto",
      },
      error: {
        true: "pr-10.5 border-red",
        false: "",
      },
      disabled: {
        true: "border-neutral-400",
        false: "",
      },
    },
    compoundVariants: [{ error: true, trailing: true, class: "pr-20" }],
    defaultVariants: {
      variant: "outline",
      leading: false,
      trailing: false,
      disabled: false,
    },
  },
);

const labelElementVariants = cva(
  "font-medium font-p-1 text-neutral-700 absolute top-1.5 left-3 transition-all",
  {
    variants: {
      active: {
        true: "font-p-3 font-normal",
        false: "",
      },
      disabled: {
        true: "text-neutral-400",
        false: "",
      },
      leading: {
        true: "left-9",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
const inputElementVariants = cva(
  "font-medium font-p-1 text-neutral-950 placeholder:text-neutral-300 outline-none w-full min-h-0 flex-1 shrink-0",
  {
    variants: {
      disabled: {
        true: "text-neutral-400 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

function TextArea({
  active = false,
  className,
  disabled = false,
  errors,
  helper,
  id,
  label,
  leadingIcon,
  resize = "none",
  trailingIcon,
  variant = "outline",
  ...props
}: TextAreaProps) {
  const hasError = Boolean(errors?.length);
  const labelActive =
    active || !!props.placeholder || !!props.value || !!props.defaultValue;

  return (
    <View className={cn("grid gap-1", className)}>
      <View
        className={cn(
          textareaContainerVariants({
            variant,
            disabled,
            error: hasError,
            leading: !!leadingIcon,
            trailing: !!trailingIcon,
            resize,
          }),
          !disabled &&
            "hover:border-neutral-950 focus-within:outline-2 focus-within:outline-primary focus-within:-outline-offset-1",
        )}
      >
        <Text
          className={cn(
            labelElementVariants({
              active: labelActive,
              disabled,
              leading: !!leadingIcon,
            }),
            !disabled &&
              "group-focus-within:font-p-3 group-focus-within:font-normal",
          )}
          nativeID={`${id}-label`}
        >
          {label}
        </Text>
        {leadingIcon ? (
          <View className="absolute left-1.5 top-1.5 z-10">
            {renderIcon(
              leadingIcon,
              disabled ? "text-neutral-400" : "text-neutral-800",
            )}
          </View>
        ) : null}
        <TextInput
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
          textAlignVertical="top"
          multiline
        />
        {trailingIcon ? (
          <View
            className={cn(
              "absolute top-1.5 z-10",
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
          <View className={cn("absolute right-1.5 top-1.5 z-10")}>
            <CircleX
              size={24}
              className={cn(disabled ? "text-neutral-400" : "text-red")}
            />
          </View>
        ) : null}
      </View>
      <If condition={hasError}>
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
      </If>
      <If condition={!!helper?.length}>
        {helper?.map((help) => (
          <View key={help} className="flex gap-1 items-start flex-row">
            <CircleAlert className="text-primary mt-0.5" size={16} />
            <Text className="font-p-2 font-normal text-neutral-800">
              {help}
            </Text>
          </View>
        ))}
      </If>
    </View>
  );
}

export { TextArea };
