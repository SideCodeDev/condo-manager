export const shadows = {
  card: "1px 1px 3px 0px #0000000f, 0px 4px 12px -2px #00000014",
  1: "1px 2px 6px -1px #0000000d",
  2: "1px 6px 16px -4px #0000001a, 0px 12px 24px -6px #00000014",
  floating: "1px 20px 40px -10px #0000000f",
  glass:
    "1px 1px 2px 0px #ffffff4d inset, -2px -2px 2px 0px #ffffff26 inset, 0px 0px 10px 0px #ffffff40 inset",
  glassFocus:
    "1px 1px 2px 0px #2b2b304d inset, -2px -2px 2px 0px #2b2b3026 inset, 0px 0px 10px 0px #2b2b3040 inset",
} as const;

export type ShadowTokenName = keyof typeof shadows;
