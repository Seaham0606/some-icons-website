import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

function Label({
  className,
  style,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex select-none items-center text-left text-[13px] font-semibold leading-[150%] text-[var(--color-main-tertiary)]',
        className,
      )}
      style={{
        paddingLeft: 'var(--spacing-050)',
        paddingRight: 'var(--spacing-050)',
        gap: 'var(--spacing-2)',
        ...style,
      }}
      {...props}
    />
  )
}

export { Label }
