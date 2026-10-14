import * as React from "react";
import { cva } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { Loader } from "./loader";
import { getSlotChild, Slot } from "./slot";

const glassButtonVariants = cva(
  "self-start flex-row items-center gap-2 rounded-full px-2 py-1 bg-white/1 text-white shadow-glass transition-all hover:shadow-glass-focus focus-visible:shadow-glass-focus focus-visible:outline-none [&_svg:not([class*='size-'])]:size-5",
);

export type GlassButtonProps = Omit<PressableProps, "children"> & {
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
      return <Text className="text-white">{child}</Text>;
    }

    if (!React.isValidElement<ChildProps>(child)) return child;

    if (child.type === React.Fragment) {
      return renderChildren(child.props.children);
    }

    if (child.type === Text) {
      return React.cloneElement(child, {
        className: cn("text-white", child.props.className),
      });
    }

    return React.cloneElement(child, {
      className: cn("text-white", child.props.className),
      color: undefined,
      size: child.props.size ?? 20,
    });
  });
}

function GlassButton({
  className,
  asChild = false,
  loading = false,
  children,
  ...props
}: GlassButtonProps) {
  const buttonClassName = glassButtonVariants({ className });
  const disabled = loading || Boolean(props.disabled);
  const content = loading ? (
    <Loader className="bg-white" size={20} />
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

export { GlassButton, glassButtonVariants };
