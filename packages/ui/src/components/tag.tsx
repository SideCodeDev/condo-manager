import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { colors } from "../theme";
import { getSlotChild, Slot } from "./slot";

const tagVariants = cva(
  "group inline-flex shrink-0 flex-row items-center gap-2 rounded-lg p-3 font-ui-7 font-semibold text-neutral-1000 outline-none transition-colors hover:bg-neutral-200 focus-visible:bg-neutral-200",
  {
    variants: {
      selected: {
        true: "bg-primary text-neutral-0 hover:bg-primary-200 hover:text-neutral-1000 focus-visible:bg-primary-200 focus-visible:text-neutral-1000",
        false: "bg-neutral-100",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

type TagVariantProps = VariantProps<typeof tagVariants>;

export type TagProps = Omit<PressableProps, "children"> &
  TagVariantProps & {
    asChild?: boolean;
    children?: React.ReactNode;
    className?: string;
  };

type TagChildProps = {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
};

function renderChildren(
  children: React.ReactNode,
  textClassName: string,
  iconColor: string,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return (
        <Text className={textClassName} numberOfLines={1}>
          {child}
        </Text>
      );
    }

    if (!React.isValidElement<TagChildProps>(child)) return child;

    if (child.type === React.Fragment) {
      return renderChildren(child.props.children, textClassName, iconColor);
    }

    if (child.type === Text) {
      return React.cloneElement(child, {
        className: cn(textClassName, child.props.className),
      });
    }

    return React.cloneElement(child, {
      color: child.props.color ?? iconColor,
      size: child.props.size ?? 20,
    });
  });
}

function Tag({
  asChild = false,
  children,
  className,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  selected = false,
  ...props
}: TagProps) {
  const isSelected = Boolean(selected);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const selectedInteractive = isSelected && (isHovered || isFocused);
  const buttonClassName = tagVariants({ className, selected: isSelected });
  const textClassName = selectedInteractive
    ? "font-ui-7 font-semibold text-neutral-1000"
    : isSelected
    ? "font-ui-7 font-semibold text-neutral-0"
    : "font-ui-7 font-semibold text-neutral-1000";
  const iconColor = selectedInteractive
    ? colors.neutral[1000]
    : isSelected
      ? colors.neutral[0]
      : colors.neutral[1000];
  const content = renderChildren(children, textClassName, iconColor);

  if (asChild) {
    const child = getSlotChild(children) as React.ReactElement<TagChildProps>;

    return (
      <Slot {...props} className={buttonClassName}>
        {React.cloneElement(child, {
          children: renderChildren(child.props.children, textClassName, iconColor),
        })}
      </Slot>
    );
  }

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={buttonClassName}
      onBlur={(event) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onHoverIn={(event) => {
        setIsHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setIsHovered(false);
        onHoverOut?.(event);
      }}
    >
      {content}
    </Pressable>
  );
}

export { Tag, tagVariants };
