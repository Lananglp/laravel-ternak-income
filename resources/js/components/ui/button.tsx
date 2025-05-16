import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[color,box-shadow] hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
          primary:
          "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        editorToolBar:
          "hover:bg-zinc-200/50 hover:dark:bg-zinc-800/50",
        editorBlockBar:
          "hover:bg-zinc-200 hover:dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-800",
        submit:
          "bg-blue-800 hover:bg-blue-700 border border-blue-800 text-white",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        danger:
          "text-red-500 hover:bg-zinc-200/50 hover:dark:bg-zinc-800/50",
        transparent: "hover:bg-transparent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        headerTransparent:
          "bg-transparent border border-transparent hover:border-zinc-400 hover:dark:border-zinc-700",
        headerOutline:
          "bg-transparent border border-zinc-400 dark:border-zinc-700 hover:border-zinc-500 hover:dark:border-zinc-600",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        editorToolBar: "w-8 h-8 text-sm",
        editorBlockBar: "h-8 text-xs px-2 py-0.5",
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        iconSm: "size-8",
        iconXs: "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
