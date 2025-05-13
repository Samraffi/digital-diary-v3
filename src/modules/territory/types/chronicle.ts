export interface TerritoryChronicleEntry {
  id: string
  territoryId: string
  date: string
  content: string
  type: 'founded' | 'upgraded' | 'achievement' | 'event' | 'other'
}

export type TerritoryChronicleType = TerritoryChronicleEntry['type']
