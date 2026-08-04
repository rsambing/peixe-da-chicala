"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  className?: string;
  containerClassName?: string;
  showLabel?: boolean;
  label?: string;
  iconClassName?: string;
  fallbackClassName?: string;
}

/**
 * Wraps next/image in `fill` mode with two states the raw `<Image>` lacks:
 * a skeleton while the image is loading, and an explicit "sem foto" state
 * (icon, not a stock photo) when there's no src or the src fails to load.
 */
export function ImageWithFallback(props: ImageWithFallbackProps) {
  // Keyed by src so switching to a different image (e.g. a carousel or
  // rotating testimonial) resets the loading/error state via remount
  // instead of a synchronizing effect.
  return <ImageWithFallbackInner key={props.src ?? "none"} {...props} />;
}

function ImageWithFallbackInner({
  src,
  alt,
  sizes,
  priority,
  unoptimized,
  className,
  containerClassName,
  showLabel = true,
  label = "Sem foto",
  iconClassName,
  fallbackClassName,
}: ImageWithFallbackProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(src ? "loading" : "error");

  const hasImage = !!src && status !== "error";

  return (
    <div className={cn("relative overflow-hidden bg-muted", containerClassName)}>
      {hasImage && (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized ?? src!.includes("ibb.co")}
          className={cn(
            className,
            "transition-opacity duration-500",
            status === "loaded" ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}

      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}

      {status === "error" && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-muted-foreground/60",
            fallbackClassName
          )}
        >
          <ImageOff className={cn("size-6", iconClassName)} />
          {showLabel && <span className="text-[11px] font-medium">{label}</span>}
        </div>
      )}
    </div>
  );
}
