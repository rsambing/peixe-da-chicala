import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        danger: "bg-destructive/10 text-destructive",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        accent: "bg-accent/20 text-accent-foreground font-bold",

        // Campaign statuses
        draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        funded: "bg-primary/10 text-primary",
        expired: "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
        paused: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        suspended: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
