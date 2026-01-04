import {
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
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
        success: <CdnIcon iconId="general-check-mark" className="w-8 h-8" />,
        info: <InfoIcon className="size-8" />,
        warning: <TriangleAlertIcon className="size-8" />,
        error: <OctagonXIcon className="size-8" />,
        loading: <Loader2Icon className="size-8 animate-spin" />,
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
