import { Analytics } from '@vercel/analytics/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { SomeIcon } from 'design-system'
import { useUIStore } from '@/stores/uiStore'
import HomePage from '@/pages/HomePage'
import ChangelogPage from '@/pages/ChangelogPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function Toaster(props: ToasterProps) {
  const theme = useUIStore((s) => s.getEffectiveTheme())

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <SomeIcon
            iconName="check-circle"
            iconStyle="fill"
            iconSize="lg"
            padding="0"
          />
        ),
        info: (
          <SomeIcon
            iconName="information-circle"
            iconStyle="outline"
            iconSize="lg"
            padding="0"
          />
        ),
        warning: (
          <SomeIcon
            iconName="check-circle"
            iconStyle="fill"
            iconSize="lg"
            padding="0"
          />
        ),
        error: (
          <SomeIcon
            iconName="warning-octagon"
            iconStyle="outline"
            iconSize="lg"
            padding="0"
          />
        ),
        loading: (
          <SomeIcon
            iconName="loading"
            iconStyle="outline"
            iconSize="lg"
            padding="0"
            className="animate-spin"
          />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            '!rounded-[999px] !border-0 !backdrop-blur-[10px] !pl-3 !pr-4 !py-2 !text-[16px] !font-semibold !w-fit !gap-3',
          success:
            '!bg-[var(--color-black-alpha-200)] dark:!bg-[var(--color-white-alpha-200)] !text-black dark:!text-white',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
        </Routes>
        <Toaster position="bottom-center" />
        <Analytics />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
