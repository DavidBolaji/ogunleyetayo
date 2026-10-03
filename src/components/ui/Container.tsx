import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-[92rem]",
  full: "max-w-none",
} as const;

export type ContainerWidth = keyof typeof widths;

interface ContainerProps {
  children: ReactNode;
  width?: ContainerWidth;
  as?: ElementType;
  className?: string;
}

/** Horizontal rhythm for the whole site lives in exactly one place. */
export function Container({
  children,
  width = "default",
  as: Tag = "div",
  className,
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-gutter", widths[width], className)}>{children}</Tag>
  );
}
