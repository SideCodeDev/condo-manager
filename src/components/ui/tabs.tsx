"use client";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { motion } from "motion/react";
import { Slot } from "radix-ui";
import {
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

const TabItemVairant = cva(
  "isolate relative inline-flex gap-2 items-center font-ui-6 text-neutral-1000 focus-visible:outline-primary focus-visible:outline-2 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        chip: "px-3 py-2 rounded-4xl",
        line: "px-1 pb-1.5 data-[active=true]:text-primary transition-colors",
      },
    },
    defaultVariants: {
      variant: "chip",
    },
  },
);

const TabItemIndicator = cva("absolute -z-1", {
  variants: {
    variant: {
      chip: "bg-neutral-0 rounded-4xl shadow-card inset-0",
      line: "bottom-0 left-0 w-full h-0.5 bg-primary rounded-3xl",
    },
  },
  defaultVariants: { variant: "chip" },
});

export function TabItem({
  value,
  asChild,
  className,
  onClick,
  children,
  ...props
}: {
  value: string;
  asChild?: boolean;
} & ComponentPropsWithoutRef<"button">) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabItem must be used within a Tabs component");
  }
  const { setActiveTab, activeTab, variant, layoutId } = context;
  const Comp = asChild ? Slot.Root : "button";
  const isActive = activeTab === value;
  return (
    <Comp
      onClick={(ev) => {
        setActiveTab(value);
        onClick?.(ev);
      }}
      data-active={isActive}
      className={TabItemVairant({ variant, className })}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className={TabItemIndicator({ variant })}
          transition={{
            type: "tween",
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      )}
      {children}
    </Comp>
  );
}

const TabsVairant = cva(
  "flex [&>&]:shrink-0 items-center gap-2 justify-center w-fit",
  {
    variants: {
      variant: {
        chip: "border border-neutral-200 bg-neutral-100 rounded-3xl p-1",
        line: "",
      },
    },
    defaultVariants: {
      variant: "chip",
    },
  },
);

export function Tabs({
  initialValue,
  children,
  variant = "chip",
  className,
}: {
  initialValue: string;
  children: ReactNode;
  variant?: "chip" | "line";
  className?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [layoutId] = useState(
    () => `tabs-${Math.random().toString(36).substr(2, 9)}`,
  );

  return (
    <TabsContext.Provider
      value={{ activeTab: value, setActiveTab: setValue, variant, layoutId }}
    >
      <div className={cn(TabsVairant({ variant }), className)}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: "chip" | "line";
  layoutId: string;
}>({ activeTab: "", setActiveTab: () => {}, variant: "line", layoutId: "" });

export function TabContent({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabContent must be used within a Tabs component");
  }
  const { activeTab } = context;
  if (activeTab !== value) return null;
  return <>{children}</>;
}
