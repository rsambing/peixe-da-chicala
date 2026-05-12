"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  variant?: "default" | "success" | "warning" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const variantColors = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  accent: "bg-accent",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const ProgressBar = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({ className, value = 0, variant = "default", size = "md", showLabel = false, animated = true, ...props }, ref) => (
  <div className="flex items-center gap-3">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-muted",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          variantColors[variant],
          animated && "origin-left"
        )}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </ProgressPrimitive.Root>
    {showLabel && (
      <span className="text-sm font-medium text-muted-foreground tabular-nums min-w-[3ch]">
        {Math.round(value)}%
      </span>
    )}
  </div>
));
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
