import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable } from "react-native-css/components";

import { cn } from "../lib/utils";
import { Loader } from "./loader";
import { getSlotChild, Slot } from "./slot";

const iconButtonVariants = cva(
  "flex-row items-center justify-center border border-neutral-200 bg-white text-black hover:bg-neutral-100 focus-visible:bg-neutral-100",
  {
    variants: {
      size: {
        large: "h-10 w-10",
        small: "h-8 w-8",
      },
      variant: {
        round: "rounded-full",
        square: "rounded-xl",
      },
    },
    defaultVariants: {
      size: "large",
      variant: "round",
    },
  },
);

type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>;

export type IconButtonProps = Omit<PressableProps, "children"> &
  IconButtonVariantProps & {
    asChild?: boolean;
    children?: React.ReactNode;
    className?: string;
    loading?: boolean;
  };

type IconChildProps = {
  className?: string;
  children?: React.ReactNode;
  color?: string;
  size?: number;
};

function renderIcon(
  children: React.ReactNode,
  iconSize: number,
  className: string,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement<IconChildProps>(child)) return child;

    if (child.type === React.Fragment) {
      return renderIcon(child.props.children, iconSize, className);
    }

    return React.cloneElement(child, {
      className: cn(className, child.props.className),
      color: undefined,
      size: child.props.size ?? iconSize,
    });
  });
}

function IconButton({
  className,
  variant = "round",
  size = "large",
  asChild = false,
  loading = false,
  children,
  ...props
}: IconButtonProps) {
  const iconSize = size === "small" ? 20 : 24;
  const buttonClassName = iconButtonVariants({ className, size, variant });
  const disabled = loading || Boolean(props.disabled);
  const content = loading ? (
    <Loader className="bg-black" size={iconSize} />
  ) : (
    renderIcon(children, iconSize, "text-black")
  );

  if (asChild && !loading) {
    const child = getSlotChild(children) as React.ReactElement<IconChildProps>;

    return (
      <Slot {...props} className={buttonClassName} disabled={disabled}>
        {React.cloneElement(child, {
          children: renderIcon(child.props.children, iconSize, "text-black"),
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
      {content}
    </Pressable>
  );
}

export { IconButton, iconButtonVariants };
