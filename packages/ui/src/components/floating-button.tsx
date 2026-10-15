import * as React from "react";
import { cva } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { Loader } from "./loader";
import { getSlotChild, Slot } from "./slot";

const floatingButtonVariants = cva(
  "shrink-0 min-w-14 h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary p-3 font-p-1 font-semibold text-white shadow-center-2 hover:bg-primary-900 focus-visible:bg-primary-900 focus-visible:outline-none disabled:pointer-events-none disabled:bg-primary",
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
        <Text className="font-p-1 font-semibold text-white" numberOfLines={1}>
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
          "font-p-1 font-semibold text-white",
          child.props.className,
        ),
      });
    }

    return React.cloneElement(child, {
      className: cn("text-white", child.props.className),
      color: undefined,
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
    <Loader className="bg-white" size={24} />
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
      {...props}
      accessibilityLabel={
        props.accessibilityLabel ??
        (loading && typeof children === "string" ? children : undefined)
      }
      accessibilityRole="button"
      className={buttonClassName}
      disabled={disabled}
    >
      {content}
    </Pressable>
  );
}

export { FloatingButton, floatingButtonVariants };
