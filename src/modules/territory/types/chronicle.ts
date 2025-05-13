export interface ChronicleEntry {
  id: string
  date: string
  content: string | Record<string, unknown> // Can be either plain text or TipTap JSON content
  category: 'history' | 'journal'
  title?: string
  mood?: string // emoji for the entry
  tags?: string[]
}

export interface ChronicleStore {
  entries: ChronicleEntry[]
  addEntry: (entry: Omit<ChronicleEntry, 'id' | 'date'>) => void
  updateEntry: (id: string, updates: Partial<ChronicleEntry>) => void
  deleteEntry: (id: string) => void
  getEntries: (category: ChronicleEntry['category']) => ChronicleEntry[]
}
