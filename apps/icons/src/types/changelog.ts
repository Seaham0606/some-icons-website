export interface ChangelogEntry {
  title: string
  version: string
  date: string
  content: string
  anchorId: string
}

export interface ChangelogIndex {
  entries: ChangelogEntry[]
}
