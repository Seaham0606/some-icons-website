import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Marketing</h1>
      <p>Placeholder app for marketing site.</p>
      <Analytics />
    </main>
  )
}
