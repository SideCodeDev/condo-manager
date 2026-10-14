import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { getSlotChild, Slot } from "./slot";

const tagVariants = cva(
  "group inline-flex shrink-0 flex-row items-center gap-2 rounded-lg p-3 font-p-1 font-semibold text-black outline-none transition-colors hover:bg-neutral-200 focus-visible:bg-neutral-200",
  {
    variants: {
      selected: {
        true: "bg-primary text-white hover:bg-primary-200 hover:text-black focus-visible:bg-primary-200 focus-visible:text-black",
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
      return renderChildren(child.props.children, textClassName);
    }

    if (child.type === Text) {
      return React.cloneElement(child, {
        className: cn(child.props.className, textClassName),
      });
    }

    return React.cloneElement(child, {
      className: cn(child.props.className, textClassName),
      color: undefined,
      size: child.props.size ?? 20,
    });
  });
}

function Tag({
  asChild = false,
  children,
  className,
  selected = false,
  ...props
}: TagProps) {
  const isSelected = Boolean(selected);
  const buttonClassName = tagVariants({ className, selected: isSelected });
  const textClassName = isSelected
    ? "font-p-1 font-semibold text-white group-hover:text-black group-focus-visible:text-black"
    : "font-p-1 font-semibold text-black";
  const content = renderChildren(children, textClassName);

  if (asChild) {
    const child = getSlotChild(children) as React.ReactElement<TagChildProps>;

    return (
      <Slot {...props} className={buttonClassName}>
        {React.cloneElement(child, {
          children: renderChildren(child.props.children, textClassName),
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
    >
      {content}
    </Pressable>
  );
}

export { Tag, tagVariants };
