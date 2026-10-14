import * as React from "react";
import { cva } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { getSlotChild, Slot } from "./slot";

const mainCardButtonVariants = cva(
  "flex-col gap-3 rounded-xl border border-neutral-100 bg-white pl-4 pr-11 py-5 font-p-1 font-semibold text-black transition-all hover:bg-neutral-50 focus-visible:bg-neutral-50 hover:shadow-2 focus-visible:shadow-2 outline-none",
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
          className="shrink-0 font-p-1 font-semibold text-black"
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
          "font-p-1 font-semibold text-black",
          child.props.className,
        ),
      });
    }

    return React.cloneElement(child, {
      className: cn("text-black", child.props.className),
      color: undefined,
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
