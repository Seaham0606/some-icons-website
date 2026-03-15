import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useUIStore } from "@/stores/uiStore"
import { CdnIcon } from "@/components/ui/cdn-icon"

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useUIStore((state) => state.getEffectiveTheme())

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CdnIcon iconId="symbol-check-circle" className="w-8 h-8" />,
        info: <CdnIcon iconId="symbol-information-circle" className="w-8 h-8" />,
        warning: <CdnIcon iconId="symbol-check-circle" className="w-8 h-8" />,
        error: <CdnIcon iconId="symbol-warning-octagon" className="w-8 h-8" />,
        loading: <CdnIcon iconId="interface-loading" className="w-8 h-8 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!rounded-[999px] !border-0 !backdrop-blur-[10px] !pl-3 !pr-4 !py-2 !text-[16px] !font-semibold !w-fit !gap-3",
          success: "!bg-[var(--color-black-alpha-200)] dark:!bg-[var(--color-white-alpha-200)] !text-black dark:!text-white",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
