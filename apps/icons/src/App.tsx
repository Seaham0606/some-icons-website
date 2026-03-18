import { Analytics } from '@vercel/analytics/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import HomePage from '@/pages/HomePage'
import ChangelogPage from '@/pages/ChangelogPage'
import GeneratorPage from '@/pages/GeneratorPage'
import SidebarTestPage from '@/pages/SidebarTestPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/generator" element={<GeneratorPage />} />
          <Route path="/sidebar-test" element={<SidebarTestPage />} />
        </Routes>
        <Toaster position="bottom-center" />
        <Analytics />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
