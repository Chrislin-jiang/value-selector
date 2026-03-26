export interface ValueDimension {
  id: number
  name: string
  emoji: string
  keyword: string
  description: string
  color: string
  bgColor: string
  textColor: string
}

export interface MicroAction {
  id: number
  valueId: number
  content: string
  difficulty: 1 | 2 | 3
  timeContext: 'morning' | 'afternoon' | 'evening' | 'anytime'
}

export interface DailyChoice {
  date: string // YYYY-MM-DD
  valueId: number
  valueName: string
  question: string
  optionsShown: number[]
  chosenAt: string
}

export interface ActionRecord {
  date: string
  valueId: number
  actionId: number
  actionContent: string
  difficulty: number
  status: 'completed' | 'skipped'
  feeling?: string
  completedAt?: string
}

export interface UserProfile {
  firstVisit: string
  streakDays: number
  lastChoiceDate: string | null
  totalChoices: number
  totalActions: number
  onboardingCompleted: boolean
}

export interface AppSettings {
  theme: 'light' | 'dark'
  notificationTime: string
}
