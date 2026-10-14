import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { Loader } from "./loader";
import { getSlotChild, Slot } from "./slot";

const buttonVariants = cva(
  "group min-w-36 shrink-0 flex-row items-center justify-center gap-2 rounded-md font-semibold transition-all disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:bg-neutral-800 active:bg-neutral-800 disabled:bg-neutral-700 disabled:text-neutral-300",
        secondary:
          "border border-neutral-950 text-neutral-950 hover:border-neutral-800 hover:text-neutral-800 focus-visible:border-neutral-800 focus-visible:text-neutral-800 active:border-neutral-800 active:text-neutral-800 disabled:border-neutral-600 disabled:text-neutral-600",
        link: "text-neutral-950 hover:text-neutral-800 focus-visible:text-neutral-800 active:text-neutral-800 disabled:text-neutral-600",
        ghost:
          "text-primary hover:text-primary-900 focus-visible:text-primary-900 active:text-primary-900 disabled:text-neutral-600",
      },
      size: {
        standard: "px-3 py-2.5",
        sm: "px-3 py-2",
      },
      destructive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        destructive: true,
        class:
          "bg-red hover:bg-red-600 focus-visible:bg-red-600 active:bg-red-600 disabled:bg-red disabled:text-white",
      },
      {
        variant: "secondary",
        destructive: true,
        class:
          "border-red text-red hover:border-red-600 hover:text-red-600 focus-visible:border-red-600 focus-visible:text-red-600 active:border-red-600 active:text-red-600 disabled:border-red disabled:text-red",
      },
      {
        variant: "link",
        destructive: true,
        class:
          "text-red hover:text-red-600 focus-visible:text-red-600 active:text-red-600 disabled:text-red",
      },
      {
        variant: "ghost",
        destructive: true,
        class:
          "text-red hover:text-red-600 focus-visible:text-red-600 active:text-red-600 disabled:text-red",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "standard",
      destructive: false,
    },
  },
);

const buttonTextVariants = cva("font-semibold", {
  variants: {
    variant: {
      primary:
        "text-white group-disabled:text-neutral-300 group-hover:text-white group-focus-visible:text-white group-active:text-white",
      secondary:
        "text-neutral-950 group-disabled:text-neutral-600 group-hover:text-neutral-800 group-focus-visible:text-neutral-800 group-active:text-neutral-800",
      link: "text-neutral-950 underline group-disabled:text-neutral-600 group-hover:text-neutral-800 group-focus-visible:text-neutral-800 group-active:text-neutral-800",
      ghost:
        "text-primary group-disabled:text-neutral-600 group-hover:text-primary-900 group-focus-visible:text-primary-900 group-active:text-primary-900",
    },
    size: {
      standard: "font-p-1",
      sm: "font-p-1",
    },
    destructive: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      destructive: true,
      class: "text-white group-disabled:text-white",
    },
    {
      variant: ["secondary", "link", "ghost"],
      destructive: true,
      class:
        "text-red group-disabled:text-red group-hover:text-red-600 group-focus-visible:text-red-600 group-active:text-red-600",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "standard",
    destructive: false,
  },
});

const buttonLoaderVariants = cva("", {
  variants: {
    variant: {
      primary: "bg-white group-disabled:bg-neutral-300",
      secondary:
        "bg-neutral-950 group-disabled:bg-neutral-600 group-hover:bg-neutral-800 group-focus-visible:bg-neutral-800 group-active:bg-neutral-800",
      link: "bg-neutral-950 group-disabled:bg-neutral-600 group-hover:bg-neutral-800 group-focus-visible:bg-neutral-800 group-active:bg-neutral-800",
      ghost:
        "bg-primary group-disabled:bg-neutral-600 group-hover:bg-primary-900 group-focus-visible:bg-primary-900 group-active:bg-primary-900",
    },
    destructive: { true: "", false: "" },
  },
  compoundVariants: [
    {
      variant: "primary",
      destructive: true,
      class: "bg-white group-disabled:bg-white",
    },
    {
      variant: ["secondary", "link", "ghost"],
      destructive: true,
      class:
        "bg-red group-disabled:bg-red group-hover:bg-red-600 group-focus-visible:bg-red-600 group-active:bg-red-600",
    },
  ],
  defaultVariants: { variant: "primary", destructive: false },
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = Omit<PressableProps, "children"> &
  Omit<ButtonVariantProps, "destructive"> & {
    asChild?: boolean;
    children?: React.ReactNode;
    className?: string;
    destructive?: boolean;
    loading?: boolean;
  };

type ChildProps = {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  disabled?: boolean | null;
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
      className: cn(child.props.className, textClassName),
      color: undefined,
      size: child.props.size ?? 24,
    });
  });
}

function Button({
  className,
  variant = "primary",
  size = "standard",
  asChild = false,
  loading,
  destructive = false,
  children,
  ...props
}: ButtonProps) {
  const resolvedVariant = variant ?? "primary";
  const resolvedSize = size ?? "standard";
  const hasDisabledProp = Object.prototype.hasOwnProperty.call(
    props,
    "disabled",
  );
  const disabled = hasDisabledProp
    ? Boolean(props.disabled)
    : Boolean(loading || props.disabled);
  const buttonClassName = cn(
    buttonVariants({
      className,
      destructive,
      size: resolvedSize,
      variant: resolvedVariant,
    }),
  );
  const textClassName = buttonTextVariants({
    destructive,
    size: resolvedSize,
    variant: resolvedVariant,
  });
  const loaderClassName = buttonLoaderVariants({
    destructive,
    variant: resolvedVariant,
  });

  const renderContent = () => {
    return loading ? (
      <Loader className={loaderClassName} size={24} />
    ) : (
      renderChildren(children, textClassName)
    );
  };

  if (asChild && !loading) {
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
      accessibilityLabel={
        props.accessibilityLabel ??
        (loading && typeof children === "string" ? children : undefined)
      }
      accessibilityRole="button"
      className={buttonClassName}
      disabled={loading || props.disabled}
      {...props}
    >
      {renderContent()}
    </Pressable>
  );
}

export { Button, buttonVariants };
