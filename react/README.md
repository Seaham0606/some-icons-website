# Some Icons - React

A React-based icon browser for the Some Icons library. Browse, search, customize, and export icons in SVG or PNG format.

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or your preferred package manager)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd react

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`

### Build

```bash
npm run build
```

Outputs to `dist/` directory.

### Other Commands

```bash
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Project Structure

```
src/
├── components/   # React components
│   ├── controls/ # Sidebar controls (search, filters, export)
│   ├── icons/    # Icon grid and card components
│   ├── layout/   # Page layout components
│   └── ui/       # Base UI primitives (Radix-based)
├── hooks/        # Custom React hooks
├── lib/          # Utilities and API functions
├── pages/        # Route page components
├── stores/       # Zustand state stores
└── types/        # TypeScript type definitions
```

## Tech Stack

| Library                                      | Purpose                                   |
| -------------------------------------------- | ----------------------------------------- |
| [React](https://react.dev)                   | UI framework                              |
| [TypeScript](https://www.typescriptlang.org) | Static type checking                      |
| [Vite](https://vite.dev)                     | Build tool with HMR                       |
| [React Router](https://reactrouter.com)      | Client-side routing                       |
| [TanStack Query](https://tanstack.com/query) | Server state management and data fetching |
| [Zustand](https://zustand.docs.pmnd.rs)      | Client state management                   |
| [Tailwind CSS](https://tailwindcss.com)      | Utility-first CSS with theming            |
| [Radix UI](https://www.radix-ui.com)         | Accessible UI primitives                  |
| [Lucide React](https://lucide.dev)           | Icons                                     |
| [JSZip](https://stuk.github.io/jszip)        | ZIP generation for exports                |
