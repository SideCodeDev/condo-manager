import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native-css/components";

import { cn } from "../lib/utils";
import { Loader } from "./loader";
import { getSlotChild, Slot } from "./slot";

const buttonVariants = cva(
  "group min-w-36 shrink-0 flex-row items-center justify-center gap-2 rounded-md font-medium transition-all disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-white hover:bg-neutral-700 focus-visible:bg-neutral-700 active:bg-neutral-700 disabled:bg-neutral-400 disabled:text-neutral-600",
        secondary:
          "border border-black text-black hover:bg-neutral-300 focus-visible:bg-neutral-300 active:bg-neutral-300 disabled:border-neutral-400 disabled:text-neutral-400",
        link: "text-black hover:text-neutral-800 focus-visible:text-neutral-800 active:text-neutral-800 disabled:text-neutral-400",
        ghost: "text-primary disabled:text-neutral-400",
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
          "bg-red hover:bg-red-800 focus-visible:bg-red-800 active:bg-red-800 disabled:bg-neutral-400 disabled:text-neutral-600",
      },
      {
        variant: "secondary",
        destructive: true,
        class:
          "border-red text-red hover:border-red-800 hover:text-red-800 focus-visible:border-red-800 focus-visible:text-red-800 active:border-red-800 active:text-red-800 disabled:border-neutral-400 disabled:text-neutral-400",
      },
      {
        variant: "link",
        destructive: true,
        class:
          "text-red hover:text-red-800 focus-visible:text-red-800 active:text-red-800 disabled:text-neutral-400",
      },
      {
        variant: "ghost",
        destructive: true,
        class:
          "text-red hover:text-red-800 focus-visible:text-red-800 active:text-red-800 disabled:text-neutral-400",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "standard",
      destructive: false,
    },
  },
);

const buttonTextVariants = cva("font-medium", {
  variants: {
    variant: {
      primary: "text-white group-disabled:text-neutral-600",
      secondary: "text-black group-disabled:text-neutral-600",
      link: "text-black underline underline-offset-4 group-disabled:text-neutral-400 group-hover:decoration-2 group-focus-visible:no-underline group-active:no-underline",
      ghost:
        "text-primary group-disabled:text-neutral-400 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4",
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

const loadingButtonVariants = cva(
  "group min-w-36 shrink-0 flex-row items-center justify-center gap-2 rounded-md font-medium transition-all disabled:pointer-events-none focus:outline-none focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary: "bg-black text-white",
        secondary: "border border-black text-black",
        link: "text-black",
        ghost: "text-primary",
      },
      size: {
        standard: "px-3 py-2.5",
        sm: "px-3 py-2",
      },
      destructive: { true: "", false: "" },
    },
    compoundVariants: [
      { variant: "primary", destructive: true, class: "bg-red text-white" },
      { variant: "secondary", destructive: true, class: "border-red text-red" },
      { variant: ["link", "ghost"], destructive: true, class: "text-red" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "standard",
      destructive: false,
    },
  },
);

const loadingTextVariants = cva("font-medium", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-black",
      link: "text-black underline underline-offset-4",
      ghost: "text-primary",
    },
    size: { standard: "font-p-1", sm: "font-p-1" },
    destructive: { true: "", false: "" },
  },
  compoundVariants: [
    { variant: "primary", destructive: true, class: "text-white" },
    { variant: ["secondary", "link", "ghost"], destructive: true, class: "text-red" },
  ],
  defaultVariants: { variant: "primary", size: "standard", destructive: false },
});

const loadingLoaderVariants = cva("", {
  variants: {
    variant: {
      primary: "bg-white",
      secondary: "bg-neutral-950",
      link: "bg-neutral-950",
      ghost: "bg-primary",
    },
    destructive: { true: "", false: "" },
  },
  compoundVariants: [
    { variant: "primary", destructive: true, class: "bg-white" },
    { variant: ["secondary", "link", "ghost"], destructive: true, class: "bg-red" },
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
  const buttonClassName = loading
    ? loadingButtonVariants({
        className,
        destructive,
        size: resolvedSize,
        variant: resolvedVariant,
      })
    : buttonVariants({
        className,
        destructive,
        size: resolvedSize,
        variant: resolvedVariant,
      });
  const textClassName = loading
    ? loadingTextVariants({
        destructive,
        size: resolvedSize,
        variant: resolvedVariant,
      })
    : buttonTextVariants({
        destructive,
        size: resolvedSize,
        variant: resolvedVariant,
      });
  const loaderClassName = loadingLoaderVariants({
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
      {...props}
      disabled={Boolean(loading || props.disabled)}
    >
      {renderContent()}
    </Pressable>
  );
}

export { Button, buttonVariants };
