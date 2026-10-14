import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";

const ANIMATION_DURATION = 4_000;
const ANIMATION_STEPS = 11;
const BASE_SIZE = 36;
const BOX_SIZE = 10;
const BOX_RADIUS = 1;

const inputRange = Array.from(
  { length: ANIMATION_STEPS + 1 },
  (_, index) => index / ANIMATION_STEPS,
);

const positions = [
  [13, 1],
  [13, 1],
  [25, 25],
  [13, 13],
  [13, 13],
  [25, 13],
  [1, 25],
  [13, 25],
  [25, 25],
] as const;

const paths = [
  [
    [0, 0],
    [-12, 0],
    [0, 0],
    [0, 0],
    [12, 0],
    [12, 12],
    [12, 12],
    [12, 12],
    [12, 0],
    [0, 0],
    [-12, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [12, 0],
    [0, 0],
    [12, 0],
    [12, 12],
    [12, 12],
    [12, 12],
    [12, 12],
    [0, 12],
    [0, 12],
    [0, 0],
  ],
  [
    [0, 0],
    [-12, 0],
    [-12, 0],
    [0, 0],
    [-12, 0],
    [-12, 0],
    [-12, 0],
    [-12, 0],
    [-12, 0],
    [-12, -12],
    [0, -12],
    [0, 0],
  ],
  [
    [0, 0],
    [-12, 0],
    [-12, 0],
    [-12, -12],
    [0, -12],
    [0, 0],
    [0, -12],
    [0, -12],
    [0, -12],
    [-12, -12],
    [-12, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [12, 0],
    [12, 0],
    [12, 0],
    [12, 0],
    [12, 0],
    [12, -12],
    [0, -12],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [-12, 0],
    [-12, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 12],
    [-12, 12],
    [-12, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [12, 0],
    [12, 0],
    [12, 0],
    [0, 0],
    [0, -12],
    [12, -12],
    [0, -12],
    [0, -12],
    [0, 0],
    [12, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [-12, 0],
    [-12, -12],
    [0, -12],
    [0, -12],
    [0, -12],
    [0, -12],
    [0, -12],
    [12, -12],
    [12, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [-12, 0],
    [-12, 0],
    [0, 0],
    [-12, 0],
    [0, 0],
    [0, 0],
    [-12, 0],
    [-12, 0],
    [-24, 0],
    [-12, 0],
    [0, 0],
  ],
] as const;

const cssEase = Easing.bezier(0.25, 0.1, 0.25, 1);
export function Loader({
  className,
  size = BASE_SIZE,
}: {
  className?: string;
  size?: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = size / BASE_SIZE;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence(
        inputRange.slice(1).map((toValue) =>
          Animated.timing(progress, {
            duration: ANIMATION_DURATION / ANIMATION_STEPS,
            easing: cssEase,
            toValue,
            useNativeDriver: true,
          }),
        ),
      ),
    );

    animation.start();

    return () => {
      animation.stop();
      progress.setValue(0);
    };
  }, [progress]);

  return (
    <View style={{ height: size, width: size }}>
      {positions.map(([left, top], index) => {
        const path = paths[index];
        const translateX = progress.interpolate({
          inputRange,
          outputRange: path.map(([x]) => x * scale),
        });
        const translateY = progress.interpolate({
          inputRange,
          outputRange: path.map(([, y]) => y * scale),
        });

        return (
          <Animated.View
            className={className}
            key={index}
            style={[
              styles.box,
              {
                borderRadius: BOX_RADIUS * scale,
                height: BOX_SIZE * scale,
                left: left * scale,
                top: top * scale,
                transform: [{ translateX }, { translateY }],
                width: BOX_SIZE * scale,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
  },
});
