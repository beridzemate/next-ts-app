"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps } from "react"
import { cn } from "../lib/utils"

interface NavLinkProps extends ComponentProps<typeof Link> {
  activeClassName?: string
  inactiveClassName?: string
  exact?: boolean // Whether the match should be exact
  title?: string // Optional tooltip
}

export function NavLink({
  className,
  activeClassName = "text-foreground",
  inactiveClassName = "text-muted-foreground hover:text-foreground",
  exact = false,
  title,
  ...props
}: NavLinkProps) {
  const path = usePathname()
  const isActive = exact ? path === props.href : path.startsWith(props.href as string)

  return (
    <Link
      {...props}
      className={cn(
        "transition-colors",
        isActive ? activeClassName : inactiveClassName,
        className
      )}
      aria-current={isActive ? "page" : undefined}
      title={title}
    />
  )
}
