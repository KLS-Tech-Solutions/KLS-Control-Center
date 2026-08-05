/**
 * Shared Recharts styling.
 *
 * Series colours are referenced as CSS custom properties so light and dark
 * steps swap with the theme without re-rendering any chart config. The four
 * slots were validated for colour-vision separation against both the light
 * (#ffffff) and dark (#0f1b2e) card surfaces.
 */
export const series = {
  s1: 'var(--s1)',
  s2: 'var(--s2)',
  s3: 'var(--s3)',
  s4: 'var(--s4)',
} as const

/**
 * Ordinal ramp — a single hue, light→dark, for ranked marks on one dimension
 * (programme mix, completion rates). Preferred over four categorical hues when
 * every mark can sit beside every other, which the categorical set can't clear.
 */
export const ordinal = ['var(--ord-1)', 'var(--ord-2)', 'var(--ord-3)', 'var(--ord-4)'] as const

/** Recessive axis styling — the data should be the loudest thing on the card. */
export const axisProps = {
  tick: { fill: 'var(--ink-muted)', fontSize: 12 },
  tickLine: false,
  axisLine: false,
} as const

export const gridProps = {
  stroke: 'var(--grid)',
  strokeDasharray: '3 3',
  vertical: false,
} as const

/** Hover cursor for bar/column charts — a soft wash rather than a hard block. */
export const barCursor = { fill: 'var(--surface-muted)', radius: 8 }
