import { cn } from '@/lib/utils'
import { SomeIcon } from 'design-system'

export function ExportNoSelectionTooltip({
  x,
  y,
  isDark,
}: {
  x: number
  y: number
  isDark: boolean
}) {
  return (
    <div
      className={cn(
        'fixed pointer-events-none z-50 pl-2 pr-4 py-1 rounded-[999px] text-base font-medium whitespace-nowrap flex items-center gap-1.5 backdrop-blur-[10px]',
        isDark ? 'text-white' : 'text-black',
      )}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)',
        backgroundColor: isDark
          ? 'var(--color-white-alpha-100)'
          : 'var(--color-black-alpha-100)',
      }}
    >
      <SomeIcon
        iconName="symbol-warning-circle"
        iconStyle="outline"
        iconSize="sm"
        padding="0"
      />
      Please select icons to download
    </div>
  )
}
