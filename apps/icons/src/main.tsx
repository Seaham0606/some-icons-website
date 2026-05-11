import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initDesignSystemScrollbarVisibility } from 'design-system'
import './index.css'
import App from './App.tsx'
import { initTheme } from '@/stores/uiStore'

// Initialize theme before render to prevent flash
initTheme()
initDesignSystemScrollbarVisibility()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
