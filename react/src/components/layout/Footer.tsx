import { Link } from 'react-router-dom'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      id="main-footer"
      className="
        absolute bottom-0 left-0 right-0 z-50
        border-t border-border-subtle
        bg-[var(--background-footer)] backdrop-blur-[10px]
        px-4 py-3 sm:px-6 sm:py-4
      "
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[var(--foreground-quaternary)]">
        <span>&copy; {currentYear} Sihan Liu</span>
        <div className="flex items-center gap-4 sm:gap-5 flex-wrap justify-center">
          <a
            href="https://www.figma.com/community/plugin/1581870303104890341/some-icons"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Figma plugin
          </a>
          <Link
            to="/changelog"
            className="hover:text-foreground transition-colors"
          >
            Changelog
          </Link>
          <a
            href="https://github.com/Seaham0606/some-icons-cdn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://choosealicense.com/licenses/mit/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            MIT License
          </a>
        </div>
      </div>
    </footer>
  )
}
