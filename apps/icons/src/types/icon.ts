export interface IconFile {
  outline?: string
  filled?: string
  color?: string
}

export interface Icon {
  id: string
  category: string
  tags?: string[]
  files: IconFile
}

export interface IconIndex {
  icons: Icon[]
}

export type IconStyle = 'outline' | 'filled' | 'color'
