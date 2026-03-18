import { cn } from "../../utils"
import { useEffect } from "react"
import type { CSSProperties, ReactNode } from "react"

export interface SidebarProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /**
   * Controls whether the sidebar is open on mobile.
   * On desktop (`md+`) the sidebar is always visible.
   */
  open: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sidebar({ children, className, open, onOpenChange, style }: SidebarProps) {
  const setOpen = (next: boolean) => onOpenChange?.(next)

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        setOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [open])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = open ? "hidden" : ""

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="ds-sidebar-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn("ds-sidebar", className)}
        data-open={open}
        style={{
          // Sidebar layout defaults (Figma-spec-like spacing)
          background: "transparent",
          rowGap: "var(--spacing-gap-2)",
          padding: "var(--spacing-padding-6)",
          paddingRight: "var(--spacing-padding-0)",
          ...style,
        }}
      >
        {children}
      </aside>
    </>
  )
}

// ─── asideHeader ───────────────────────────────────────────────────────────────

export interface SidebarAsideHeaderProps {
  children: ReactNode
  className?: string
}

export function SidebarAsideHeader({ children, className }: SidebarAsideHeaderProps) {
  return (
    <div className={cn("ds-sidebar__header", className)}>
      {children}
    </div>
  )
}

// ─── contentSlot ───────────────────────────────────────────────────────────────

export interface SidebarContentSlotProps {
  children: ReactNode
  className?: string
}

export function SidebarContentSlot({ children, className }: SidebarContentSlotProps) {
  return (
    <div className={cn("ds-sidebar__content", className)}>
      {children}
    </div>
  )
}

// ─── asideFooter ───────────────────────────────────────────────────────────────

export interface SidebarAsideFooterProps {
  children: ReactNode
  className?: string
}

export function SidebarAsideFooter({ children, className }: SidebarAsideFooterProps) {
  return (
    <div className={cn("ds-sidebar__footer", className)}>
      {children}
    </div>
  )
}
