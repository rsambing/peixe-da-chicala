"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  verified?: boolean;
}

const sizeClasses = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
};

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, src, alt, fallback, size = "md", verified = false, ...props }, ref) => (
  <div className="relative inline-flex">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        className="aspect-square size-full object-cover"
        src={src}
        alt={alt || fallback || "Avatar"}
      />
      <AvatarPrimitive.Fallback
        className="flex size-full items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
        delayMs={200}
      >
        {getInitials(fallback)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>

    {verified && (
      <div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-primary p-0.5">
        <svg className="size-3 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    )}
  </div>
));
Avatar.displayName = "Avatar";

export { Avatar };
