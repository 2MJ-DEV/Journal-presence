import * as React from "react"
import { cn } from "cn"

function Button({ className, variant = "default", size = "default", ...props }: React.ComponentProps<"button"> & { variant?: "default" | "outline" | "ghost"; size?: "default" | "sm" }) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
        size === "default" && "h-9 px-4",
        size === "sm" && "h-8 px-3 text-xs",
        className
      )}
      {...props}
    />
  )
}

export { Button }
