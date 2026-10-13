import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { colors } from "../theme";
import { getSlotChild, Slot } from "./slot";

const listButtonVariants = cva(
  "flex-row shrink-0 items-center justify-center outline-none gap-2 rounded text-neutral-1000 font-ui-6 transition-all hover:bg-neutral-100 focus-visible:bg-neutral-100",
  {
    variants: {
      variant: {
        standalone: "py-3 px-4",
        dropdown: "p-3 font-semibold",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "dropdown",
        selected: true,
        class:
          "bg-primary-200 ring ring-primary hover:bg-primary-200 focus-visible:bg-primary-200",
      },
    ],
    defaultVariants: {
      variant: "standalone",
      selected: false,
    },
  },
);

type ListButtonVariantProps = VariantProps<typeof listButtonVariants>;

export type ListButtonProps = Omit<PressableProps, "children"> &
  ListButtonVariantProps & {
    asChild?: boolean;
    children?: React.ReactNode;
    className?: string;
  };

type ChildProps = {
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

    if (!React.isValidElement<ChildProps>(child)) return child;

    if (child.type === React.Fragment) {
      return renderChildren(child.props.children, textClassName);
    }

    if (child.type === Text) {
      return React.cloneElement(child, {
        className: cn(textClassName, child.props.className),
      });
    }

    return React.cloneElement(child, {
      color: child.props.color ?? colors.neutral[1000],
      size: child.props.size ?? 24,
    });
  });
}

function ListButton({
  className,
  variant = "standalone",
  asChild = false,
  selected = false,
  children,
  ...props
}: ListButtonProps) {
  const buttonClassName = listButtonVariants({
    className,
    selected: Boolean(selected),
    variant,
  });
  const disabled = Boolean(props.disabled);
  const isSelected = Boolean(selected);
  const textClassName = cn(
    "font-ui-6 text-neutral-1000",
    variant === "dropdown" && "font-semibold",
  );

  if (asChild) {
    const child = getSlotChild(children) as React.ReactElement<ChildProps>;

    return (
      <Slot {...props} className={buttonClassName} disabled={disabled}>
        {React.cloneElement(child, {
          children: renderChildren(child.props.children, textClassName),
        })}
      </Slot>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isSelected }}
      className={buttonClassName}
      disabled={disabled}
      {...props}
    >
      {renderChildren(children, textClassName)}
    </Pressable>
  );
}

export { ListButton, listButtonVariants };
