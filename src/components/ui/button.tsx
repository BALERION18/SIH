import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-heritage active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl active:scale-95",
        outline:
          "border-2 border-primary/30 bg-transparent backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 shadow-glass hover:shadow-glow active:scale-95",
        secondary:
          "bg-secondary/90 backdrop-blur-sm text-secondary-foreground hover:bg-secondary shadow-glass hover:shadow-heritage active:scale-95",
        ghost: "bg-transparent hover:bg-primary/10 hover:text-primary transition-all duration-300 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow active:scale-95",
        glass: "bg-gradient-glass backdrop-blur-xl border-2 border-white/30 text-foreground hover:bg-white/20 hover:border-white/50 shadow-glass hover:shadow-glow transition-all duration-300 active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm min-w-[44px]",
        sm: "h-9 rounded-md px-4 text-xs min-w-[36px]",
        lg: "h-12 rounded-md px-8 text-base min-w-[48px]",
        icon: "h-11 w-11 min-w-[44px] min-h-[44px]",
        xs: "h-7 px-2 text-xs min-w-[28px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
