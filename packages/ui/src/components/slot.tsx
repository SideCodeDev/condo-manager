import * as React from "react";

type SlotValue = unknown;
type SlotPropsMap = Record<string, SlotValue>;

export type SlotProps = {
  children: React.ReactNode;
  className?: string;
  style?: SlotValue;
  [name: string]: SlotValue;
};

function getSlotChild(children: React.ReactNode): React.ReactElement {
  const child = React.Children.only(children);

  if (!React.isValidElement(child)) {
    throw new Error("Slot requires a single React element as its child.");
  }

  return child;
}

function composeEventHandlers(
  slotHandler: SlotValue,
  childHandler: SlotValue,
): SlotValue {
  if (typeof slotHandler !== "function" || typeof childHandler !== "function") {
    return childHandler ?? slotHandler;
  }

  return (...args: never[]) => {
    childHandler(...args);
    slotHandler(...args);
  };
}

function mergeProps(slotProps: SlotPropsMap, childProps: SlotPropsMap): SlotPropsMap {
  const mergedProps: SlotPropsMap = { ...slotProps };

  for (const [name, childValue] of Object.entries(childProps)) {
    const slotValue = slotProps[name];

    if (/^on[A-Z]/.test(name)) {
      mergedProps[name] = composeEventHandlers(slotValue, childValue);
      continue;
    }

    if (name === "className" && typeof slotValue === "string") {
      mergedProps[name] = [slotValue, childValue].filter(Boolean).join(" ");
      continue;
    }

    if (name === "style" && slotValue != null) {
      mergedProps[name] = [slotValue, childValue];
      continue;
    }

    mergedProps[name] = childValue;
  }

  return mergedProps;
}

function Slot({ children, ...slotProps }: SlotProps) {
  const child = getSlotChild(children);

  return React.cloneElement(
    child,
    mergeProps(slotProps, child.props as SlotProps) as never,
  );
}

export { Slot, getSlotChild };
