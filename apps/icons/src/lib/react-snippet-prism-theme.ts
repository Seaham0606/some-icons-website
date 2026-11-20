import type { PrismTheme } from 'prism-react-renderer'

/** Semantic tokens → design-system CSS variables (light/dark follow `[data-theme]`). */
export const reactSnippetPrismTheme: PrismTheme = {
  plain: {
    color: 'var(--color-main-secondary)',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['keyword', 'changed', 'keyword-control', 'module'],
      style: { color: 'var(--color-intent-accent-strong)' },
    },
    {
      types: ['string', 'char', 'attr-value', 'template-string'],
      style: { color: 'var(--color-intent-success-strong)' },
    },
    {
      types: ['function', 'function-variable'],
      style: { color: 'var(--color-main-primary)' },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol', 'inserted'],
      style: { color: 'var(--color-intent-warning-strong)' },
    },
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: 'var(--color-main-tertiary)', fontStyle: 'italic' },
    },
    {
      types: ['class-name', 'maybe-class-name', 'tag', 'builtin'],
      style: { color: 'var(--color-intent-accent)' },
    },
    {
      types: ['operator', 'punctuation', 'important'],
      style: { color: 'var(--color-main-tertiary)' },
    },
    {
      types: ['property', 'literal-property'],
      style: { color: 'var(--color-intent-accent-strong)' },
    },
    {
      types: ['parameter', 'variable', 'shell-symbol'],
      style: { color: 'var(--color-main-secondary)' },
    },
    {
      types: ['regex'],
      style: { color: 'var(--color-intent-success)' },
    },
    {
      types: ['attr-name'],
      style: { color: 'var(--color-intent-warning-strong)' },
    },
    {
      types: ['deleted'],
      style: { color: 'var(--color-intent-error-strong)' },
    },
  ],
}
