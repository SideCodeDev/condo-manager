import * as React from "react";
import { cva } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { colors } from "../theme";
import { getSlotChild, Slot } from "./slot";

const mainCardButtonVariants = cva(
  "flex-col gap-3 rounded-xl border border-neutral-100 bg-neutral-0 pl-4 pr-11 py-5 font-ui-6 font-semibold text-neutral-1000 transition-all hover:bg-neutral-50 focus-visible:bg-neutral-50 hover:shadow-2 focus-visible:shadow-2 outline-none",
);

export type MainCardButtonProps = Omit<PressableProps, "children"> & {
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

function renderChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return (
        <Text
          className="shrink-0 font-ui-6 font-semibold text-neutral-1000"
          ellipsizeMode="clip"
          numberOfLines={1}
        >
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
          "font-ui-6 font-semibold text-neutral-1000",
          child.props.className,
        ),
      });
    }

    return React.cloneElement(child, {
      color: child.props.color ?? colors.neutral[1000],
      size: child.props.size ?? 32,
    });
  });
}

function MainCardButton({
  className,
  asChild = false,
  children,
  ...props
}: MainCardButtonProps) {
  const buttonClassName = mainCardButtonVariants({ className });
  const disabled = Boolean(props.disabled);

  if (asChild) {
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
      accessibilityRole="button"
      className={buttonClassName}
      disabled={disabled}
      {...props}
    >
      {renderChildren(children)}
    </Pressable>
  );
}

export { MainCardButton, mainCardButtonVariants };
