"use client";

export function If({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) {
  if (!condition) return null;
  return <>{children}</>;
}
