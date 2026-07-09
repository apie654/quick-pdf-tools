import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95": variant === "default",
            "bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-95": variant === "destructive",
            "border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700": variant === "outline",
            "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700": variant === "secondary",
            "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300": variant === "ghost",
            "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline": variant === "link",
            "h-11 px-5 py-2": size === "default",
            "h-9 rounded-lg px-4": size === "sm",
            "h-14 rounded-2xl px-8 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
