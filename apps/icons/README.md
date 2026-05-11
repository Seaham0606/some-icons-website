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
│   ├── changelog/
│   ├── export/
│   ├── generator/
│   ├── icons/    # Icon grid and card (wraps design-system)
│   ├── layout/
│   └── overlay/
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
| [Tailwind CSS](https://tailwindcss.com) v4   | Utility classes on app routes (`@tailwindcss/vite`)                     |
| `design-system` (workspace)                  | Shared UI, tokens, `SomeIcon`; most sidebar/chrome                      |
| [JSZip](https://stuk.github.io/jszip)        | Multi-file exports as ZIP (`src/lib/export-utils.ts`)                    |
