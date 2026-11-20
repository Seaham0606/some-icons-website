import { useLocation } from 'react-router-dom'
import { getPageMeta } from '@/lib/seo'
import { usePageMeta } from '@/hooks/usePageMeta'

export function DocumentHead() {
  const { pathname } = useLocation()
  usePageMeta(getPageMeta(pathname))
  return null
}
