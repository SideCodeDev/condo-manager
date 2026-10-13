import * as React from "react";
import { cva } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { colors } from "../theme";
import { Loader } from "./loader";
import { getSlotChild, Slot } from "./slot";

const floatingButtonVariants = cva(
  "shrink-0 min-w-14 h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary p-3 font-ui-6 font-semibold text-neutral-0 shadow-floating hover:bg-primary-900 focus-visible:bg-primary-900",
);

export type FloatingButtonProps = Omit<PressableProps, "children"> & {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
};

type ChildProps = {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
};

function renderChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return (
        <Text className="font-ui-6 font-semibold text-neutral-0" numberOfLines={1}>
          {child}
        </Text>
      );
    }

    if (!React.isValidElement<ChildProps>(child)) return child;

    if (child.type === React.Fragment) {
      return renderChildren(child.props.children);
    }

    if (child.type === Text) {
      return React.cloneElement(child, {
        className: cn(
          "font-ui-6 font-semibold text-neutral-0",
          child.props.className,
        ),
      });
    }

    return React.cloneElement(child, {
      color: child.props.color ?? colors.neutral[0],
      size: child.props.size ?? 32,
    });
  });
}

function FloatingButton({
  asChild = false,
  className,
  loading = false,
  children,
  ...props
}: FloatingButtonProps) {
  const buttonClassName = floatingButtonVariants({ className });
  const disabled = loading || Boolean(props.disabled);
  const content = loading ? (
    <Loader color={colors.neutral[0]} size={24} />
  ) : (
    renderChildren(children)
  );

  if (asChild && !loading) {
    const child = getSlotChild(children) as React.ReactElement<ChildProps>;

    return (
      <Slot {...props} className={buttonClassName} disabled={disabled}>
        {React.cloneElement(child, {
          children: renderChildren(child.props.children),
        })}
      </Slot>
    );
  }

  return (
    <Pressable
      accessibilityLabel={
        props.accessibilityLabel ??
        (loading && typeof children === "string" ? children : undefined)
      }
      accessibilityRole="button"
      className={buttonClassName}
      disabled={disabled}
      {...props}
    >
      {content}
    </Pressable>
  );
}

export { FloatingButton, floatingButtonVariants };
