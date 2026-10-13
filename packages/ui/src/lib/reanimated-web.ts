import { View } from "react-native";

type SharedValue<T> = { value: T };

export const Easing = {
  bezier: () => undefined,
};

export function useSharedValue<T>(initialValue: T): SharedValue<T> {
  return { value: initialValue };
}

export function withTiming<T>(value: T): T {
  return value;
}

export function useAnimatedStyle<T>(updater: () => T): T {
  return updater();
}

const Animated = { View };

export default Animated;
