import type { ButtonStateIcon } from 'design-system'

/** Idle → success strip for bulk bar copy and info-panel snippet copy. */
export const BULK_COPY_STATE_ICONS = [
  { iconName: 'copy', iconStyle: 'outline' },
  {
    iconName: 'check-mark',
    iconStyle: 'outline',
    color: 'var(--color-intent-success-strong)',
  },
] as const satisfies [ButtonStateIcon, ButtonStateIcon]
