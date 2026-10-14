import * as React from "react";
import { cva } from "class-variance-authority";
import {
  Platform,
  type LayoutChangeEvent,
  type PressableProps,
} from "react-native";
import { Pressable, Text, View } from "react-native-css/components";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { cn } from "../lib/utils";
import { getSlotChild, Slot } from "./slot";

type TabsVariant = "chip" | "line" | "line-spaced";

const tabItemVariants = cva(
  "isolate relative flex-row shrink-0 items-center gap-2 font-p-1 text-black focus-visible:outline-primary focus-visible:outline-2",
  {
    variants: {
      variant: {
        chip: "rounded-4xl px-3 py-2",
        line: "px-1 pb-1.5 transition-colors delay-200",
      },
      active: { true: "", false: "" },
      spaced: { true: "pb-3.5", false: "" },
    },
    compoundVariants: [
      { variant: "line", active: true, class: "text-primary" },
    ],
    defaultVariants: { variant: "chip", active: false, spaced: false },
  },
);

const tabIndicatorVariants = cva(
  "absolute transition-[left,top,width,height] duration-200 ease-in-out",
  {
    variants: {
      variant: {
        chip: "z-0 rounded-4xl bg-white shadow-card",
        line: "z-0 rounded-3xl bg-primary",
      },
    },
    defaultVariants: { variant: "chip" },
  },
);

const tabsVariants = cva(
  "relative flex-row items-center justify-center gap-2 self-start w-fit",
  {
    variants: {
      variant: {
        chip: "rounded-3xl border border-neutral-200 bg-neutral-100 p-1",
        line: "",
      },
    },
    defaultVariants: { variant: "chip" },
  },
);

type TabChildProps = {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
};

function renderTabChildren(
  children: React.ReactNode,
  textClassName: string,
  iconClassName?: string,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={textClassName}>{child}</Text>;
    }
    if (!React.isValidElement<TabChildProps>(child)) return child;
    if (child.type === React.Fragment) {
      return renderTabChildren(
        child.props.children,
        textClassName,
        iconClassName,
      );
    }
    if (child.type === Text) {
      return React.cloneElement(child, {
        className: cn(textClassName, child.props.className),
      });
    }
    return React.cloneElement(child, {
      color: undefined,
      className: cn(child.props.className, iconClassName, textClassName),
      size: child.props.size ?? 20,
    });
  });
}

type TabLayout = { height: number; width: number; x: number; y: number };

type TabsContextValue = {
  activeTab: string;
  registerLayout: (value: string, layout: TabLayout) => void;
  setActiveTab: (value: string) => void;
  variant: TabsVariant;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export type TabItemProps = Omit<PressableProps, "children" | "onPress"> & {
  value: string;
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
  onPress?: PressableProps["onPress"];
};

function TabItem({
  asChild = false,
  children,
  className,
  onLayout,
  onPress,
  value,
  ...props
}: TabItemProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabItem must be used within a Tabs component");

  const isActive = context.activeTab === value;
  const variant = context.variant === "line-spaced" ? "line" : context.variant;
  const textClassName = cn(
    "font-p-1",
    context.variant !== "chip" && "transition-colors delay-200",
    context.variant === "line" || context.variant === "line-spaced"
      ? isActive
        ? "text-primary"
        : "text-black"
      : "text-black",
  );
  const handleLayout = (event: LayoutChangeEvent) => {
    if (Platform.OS !== "web") {
      context.registerLayout(value, event.nativeEvent.layout);
    }
    onLayout?.(event);
  };
  const itemClassName = tabItemVariants({
    active: isActive,
    className,
    spaced: context.variant === "line-spaced",
    variant,
  });
  const content = renderTabChildren(
    children,
    textClassName,
    context.variant !== "chip" ? "transition-colors delay-200" : undefined,
  );

  if (asChild) {
    const child = getSlotChild(children) as React.ReactElement<TabChildProps>;
    return (
      <Slot
        {...props}
        className={itemClassName}
        nativeID={`tabs-${value}`}
        onLayout={handleLayout}
        onPress={(event: unknown) => {
          context.setActiveTab(value);
          onPress?.(event as never);
        }}
      >
        {React.cloneElement(child, { children: content })}
      </Slot>
    );
  }

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      className={itemClassName}
      nativeID={`tabs-${value}`}
      onLayout={handleLayout}
      onPress={(event) => {
        context.setActiveTab(value);
        onPress?.(event);
      }}
    >
      {content}
    </Pressable>
  );
}

export type TabsProps = {
  initialValue: string;
  children: React.ReactNode;
  variant?: TabsVariant;
  className?: string;
};

function Tabs({
  children,
  className,
  initialValue,
  variant = "chip",
}: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(initialValue);
  const [layouts, setLayouts] = React.useState<Record<string, TabLayout>>({});
  const childArray = React.Children.toArray(children);
  const tabChildren = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === TabContent),
  );
  const contentChildren = childArray.filter(
    (child) => React.isValidElement(child) && child.type === TabContent,
  );
  const tabsRootId = `tabs-root-${React.useId().replace(/:/g, "")}`;
  const registerLayout = React.useCallback(
    (value: string, layout: TabLayout) => {
      setLayouts((current) => ({ ...current, [value]: layout }));
    },
    [],
  );
  const activeLayout = layouts[activeTab];
  const indicatorX = useSharedValue(0);
  const indicatorY = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorHeight = useSharedValue(0);

  React.useEffect(() => {
    if (Platform.OS !== "web") return;

    const measure = () => {
      const root =
        document.getElementById(tabsRootId) ??
        (window.parent !== window
          ? window.parent.document.getElementById(tabsRootId)
          : null);
      if (!root) return;

      const rootRect = root.getBoundingClientRect();
      root.querySelectorAll('[id^="tabs-"]').forEach((node) => {
        const rect = node.getBoundingClientRect();
        const value = node.id.slice("tabs-".length);
        registerLayout(value, {
          height: rect.height,
          width: rect.width,
          x: rect.left - rootRect.left - root.clientLeft,
          y: rect.top - rootRect.top - root.clientTop,
        });
      });
    };

    const frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [children, registerLayout, tabsRootId, variant]);

  React.useEffect(() => {
    if (!activeLayout) return;
    const isLine = variant !== "chip";
    const targetY = isLine
      ? activeLayout.y + activeLayout.height - 2
      : activeLayout.y;
    const targetHeight = isLine ? 2 : activeLayout.height;
    const config = { duration: 200, easing: Easing.bezier(0.42, 0, 0.58, 1) };
    indicatorX.value = withTiming(activeLayout.x, config);
    indicatorY.value = withTiming(targetY, config);
    indicatorWidth.value = withTiming(activeLayout.width, config);
    indicatorHeight.value = withTiming(targetHeight, config);
  }, [
    activeLayout,
    indicatorHeight,
    indicatorWidth,
    indicatorX,
    indicatorY,
    variant,
  ]);

  const indicatorStyle = useAnimatedStyle(
    () => ({
      height: indicatorHeight.value,
      left: indicatorX.value,
      top: indicatorY.value,
      width: indicatorWidth.value,
    }),
    [],
  );
  const webIndicatorStyle = activeLayout
    ? {
        height: variant === "chip" ? activeLayout.height : 2,
        left: activeLayout.x,
        top:
          variant === "chip"
            ? activeLayout.y
            : activeLayout.y + activeLayout.height - 2,
        width: activeLayout.width,
      }
    : undefined;
  return (
    <TabsContext.Provider
      value={{ activeTab, registerLayout, setActiveTab, variant }}
    >
      <View
        className={cn(
          tabsVariants({
            variant: variant === "line-spaced" ? "line" : variant,
          }),
          className,
        )}
        nativeID={tabsRootId}
      >
        <Animated.View
          className={tabIndicatorVariants({
            variant: variant === "line-spaced" ? "line" : variant,
          })}
          pointerEvents="none"
          style={Platform.OS === "web" ? webIndicatorStyle : indicatorStyle}
        />
        {tabChildren}
      </View>
      {contentChildren}
    </TabsContext.Provider>
  );
}

export type TabContentProps = { value: string; children: React.ReactNode };

function TabContent({ children, value }: TabContentProps) {
  const context = React.useContext(TabsContext);
  if (!context)
    throw new Error("TabContent must be used within a Tabs component");
  return context.activeTab === value ? <>{children}</> : null;
}

export {
  TabContent,
  TabItem,
  Tabs,
  tabIndicatorVariants,
  tabItemVariants,
  tabsVariants,
};
