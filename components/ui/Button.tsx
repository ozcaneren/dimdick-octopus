"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
    | "secondary";
  sizeVariant?: "sm" | "md" | "lg" | "xl" | "icon";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      sizeVariant = "md",
      leftIcon,
      rightIcon,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-foreground text-background hover:bg-foreground/90",
      secondary: "bg-secondary text-foreground hover:bg-secondary/90",
      destructive: "bg-destructive text-white hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-muted",
      ghost: "hover:bg-muted",
      link: "text-primary underline underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "h-8 text-sm px-3",
      md: "h-10 text-base px-4",
      lg: "h-12 text-lg px-6",
      xl: "h-14 text-xl px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium",
          "transition-colors focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "cursor-pointer",
          variants[variant],
          sizes[sizeVariant],
          sizeVariant === "icon" && "p-0",
          className
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="h-4 w-4">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="h-4 w-4">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
