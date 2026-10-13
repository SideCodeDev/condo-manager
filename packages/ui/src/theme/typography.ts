export const fontFamilies = {
  sans: "DM Sans",
  mono: "DM Sans",
} as const;

export const typography = {
  ui1: { fontSize: 48, lineHeight: 52 },
  ui2: { fontSize: 32, lineHeight: 36 },
  ui3: { fontSize: 24, lineHeight: 28 },
  ui4: { fontSize: 20, lineHeight: 24 },
  ui5: { fontSize: 20, lineHeight: 24 },
  ui6: { fontSize: 18, lineHeight: 22 },
  ui7: { fontSize: 16, lineHeight: 20 },
  ui8: { fontSize: 14, lineHeight: 18 },
  ui9: { fontSize: 12, lineHeight: 16 },
  ui10: { fontSize: 10, lineHeight: 16 },
  p1: { fontSize: 18, lineHeight: 26 },
  p2: { fontSize: 16, lineHeight: 24 },
  p3: { fontSize: 14, lineHeight: 22 },
  p4: { fontSize: 12, lineHeight: 20 },
  desktopH1: { fontSize: 48, lineHeight: 56 },
  desktopH2: { fontSize: 32, lineHeight: 40 },
  desktopH3: { fontSize: 24, lineHeight: 32 },
  desktopH4: { fontSize: 20, lineHeight: 28 },
  mobileD1: { fontSize: 32, lineHeight: 40 },
  mobileD2: { fontSize: 32, lineHeight: 40 },
  mobileH1: { fontSize: 24, lineHeight: 32 },
  mobileH2: { fontSize: 20, lineHeight: 28 },
} as const;

export type TypographyTokenName = keyof typeof typography;
