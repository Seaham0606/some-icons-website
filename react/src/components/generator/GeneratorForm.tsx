import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { toast } from 'sonner'

type ReleaseType = 'major' | 'minor' | 'patch'

const RELEASE_TYPE_OPTIONS = [
  { value: 'major' as const, label: 'Major' },
  { value: 'minor' as const, label: 'Minor' },
  { value: 'patch' as const, label: 'Patch' },
]

interface FormData {
  version: string
  releaseType: ReleaseType
  date: string
  title: string
  summary: string
  added: string
  changed: string
  fixed: string
  removed: string
  deprecated: string
  notes: string
}

function formatBulletPoints(text: string): string {
  if (!text.trim()) return ''

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line) => `- ${line}`)
    .join('\n')
}

function generateMarkdown(data: FormData): string {
  const lines: string[] = []

  lines.push('---')
  lines.push(`version: "${data.version}"`)
  lines.push(`date: "${data.date}"`)
  lines.push(`title: "${data.title}"`)
  lines.push('---')
  lines.push('')

  if (data.summary) {
    lines.push(data.summary)
    lines.push('')
  }

  const sections = [
    { key: 'added', title: 'Added' },
    { key: 'changed', title: 'Changed' },
    { key: 'fixed', title: 'Fixed' },
    { key: 'removed', title: 'Removed' },
    { key: 'deprecated', title: 'Deprecated' },
  ] as const

  for (const section of sections) {
    const content = data[section.key]
    if (content.trim()) {
      lines.push(`### ${section.title}`)
      lines.push('')
      lines.push(formatBulletPoints(content))
      lines.push('')
    }
  }

  if (data.notes.trim()) {
    lines.push('### Notes')
    lines.push('')
    lines.push(data.notes)
    lines.push('')
  }

  return lines.join('\n')
}

export function GeneratorForm() {
  const [formData, setFormData] = useState<FormData>({
    version: '',
    releaseType: 'minor',
    date: new Date().toISOString().split('T')[0],
    title: '',
    summary: '',
    added: '',
    changed: '',
    fixed: '',
    removed: '',
    deprecated: '',
    notes: '',
  })

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleGenerate = () => {
    if (!formData.version || !formData.title) {
      toast.error('Version and title are required')
      return
    }

    const markdown = generateMarkdown(formData)

    navigator.clipboard.writeText(markdown).then(() => {
      toast.success('Markdown copied to clipboard!')
    }).catch(() => {
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formData.version}.md`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Markdown file downloaded!')
    })
  }

  const handleClear = () => {
    setFormData({
      version: '',
      releaseType: 'minor',
      date: new Date().toISOString().split('T')[0],
      title: '',
      summary: '',
      added: '',
      changed: '',
      fixed: '',
      removed: '',
      deprecated: '',
      notes: '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            placeholder="v1.0.0"
            value={formData.version}
            onChange={handleChange('version')}
          />
        </div>

        <div className="space-y-2">
          <Label>Release Type</Label>
          <SegmentedControl<ReleaseType>
            options={RELEASE_TYPE_OPTIONS}
            value={formData.releaseType}
            onChange={(value) => setFormData((prev) => ({ ...prev, releaseType: value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={handleChange('date')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Release title"
            value={formData.title}
            onChange={handleChange('title')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          placeholder="Brief description of the release..."
          value={formData.summary}
          onChange={handleChange('summary')}
          rows={2}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="added">Added (one item per line)</Label>
          <Textarea
            id="added"
            placeholder="New feature 1&#10;New feature 2"
            value={formData.added}
            onChange={handleChange('added')}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="changed">Changed (one item per line)</Label>
          <Textarea
            id="changed"
            placeholder="Updated component&#10;Improved performance"
            value={formData.changed}
            onChange={handleChange('changed')}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fixed">Fixed (one item per line)</Label>
          <Textarea
            id="fixed"
            placeholder="Bug fix 1&#10;Bug fix 2"
            value={formData.fixed}
            onChange={handleChange('fixed')}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="removed">Removed (one item per line)</Label>
          <Textarea
            id="removed"
            placeholder="Deprecated feature"
            value={formData.removed}
            onChange={handleChange('removed')}
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deprecated">Deprecated (one item per line)</Label>
        <Textarea
          id="deprecated"
          placeholder="Feature to be removed"
          value={formData.deprecated}
          onChange={handleChange('deprecated')}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any additional information..."
          value={formData.notes}
          onChange={handleChange('notes')}
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleGenerate} className="flex-1">
          Generate Markdown
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}
