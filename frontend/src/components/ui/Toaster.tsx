"use client";

import { Toaster as SonnerToaster } from "sonner";

function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "bg-card text-card-foreground border shadow-lg rounded-xl",
          title: "font-semibold",
          description: "text-muted-foreground text-sm",
          success: "border-success/30",
          error: "border-destructive/30",
          info: "border-blue-200",
        },
      }}
    />
  );
}

export { Toaster };
