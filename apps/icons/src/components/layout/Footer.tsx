export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      id="main-footer"
      className="absolute bottom-0 left-0 right-0 z-50"
      style={{
        background: 'var(--win-bg)',
        borderTop: '2px solid var(--win-shadow)',
        boxShadow: 'inset 0 1px 0 var(--win-light)',
        padding: '2px 6px',
        fontFamily: "'Tahoma','MS Sans Serif',Arial,sans-serif",
        fontSize: '11px',
      }}
    >
      <div className="flex flex-row items-center justify-between gap-1" style={{ color: 'var(--win-text)' }}>
        <div className="flex items-center gap-4">
          <span style={{ color: 'var(--win-text-disabled)' }}>&copy; {currentYear} Sihan Liu</span>
          <a
            href="https://choosealicense.com/licenses/mit/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--win-navy)', textDecoration: 'underline' }}
          >
            MIT License
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.figma.com/community/plugin/1581870303104890341/some-icons"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--win-navy)', textDecoration: 'underline' }}
            aria-label="Some Icons Figma plugin"
          >
            Figma Plugin
          </a>
          <a
            href="https://github.com/Seaham0606/some-icons-cdn"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--win-navy)', textDecoration: 'underline' }}
            aria-label="Some Icons GitHub repository"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
