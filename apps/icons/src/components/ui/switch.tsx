import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

function Switch({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn('ui-switch', className)}
      style={style}
      {...props}
    >
      <SwitchPrimitive.Thumb className="ui-switch__thumb" data-slot="switchThumb" />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
