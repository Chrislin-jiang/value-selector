'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile, DailyChoice, ActionRecord } from '@/types'
import { format } from 'date-fns'

interface AppState {
  userProfile: UserProfile
  choices: DailyChoice[]
  actions: ActionRecord[]

  // Actions
  completeOnboarding: () => void
  addChoice: (choice: DailyChoice) => void
  addAction: (action: ActionRecord) => void
  updateStreakDays: () => void
  getTodayChoice: () => DailyChoice | undefined
  getTodayAction: () => ActionRecord | undefined
}

const defaultProfile: UserProfile = {
  firstVisit: new Date().toISOString(),
  streakDays: 0,
  lastChoiceDate: null,
  totalChoices: 0,
  totalActions: 0,
  onboardingCompleted: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userProfile: defaultProfile,
      choices: [],
      actions: [],

      completeOnboarding: () =>
        set((state) => ({
          userProfile: { ...state.userProfile, onboardingCompleted: true },
        })),

      addChoice: (choice: DailyChoice) => {
        const today = format(new Date(), 'yyyy-MM-dd')
        set((state) => {
          const existingIndex = state.choices.findIndex((c) => c.date === today)
          const newChoices =
            existingIndex >= 0
              ? state.choices.map((c, i) => (i === existingIndex ? choice : c))
              : [...state.choices, choice]

          // Update streak
          const lastDate = state.userProfile.lastChoiceDate
          let streakDays = state.userProfile.streakDays
          if (lastDate) {
            const yesterday = format(
              new Date(Date.now() - 86400000),
              'yyyy-MM-dd'
            )
            if (lastDate === yesterday) {
              streakDays += 1
            } else if (lastDate !== today) {
              streakDays = 1
            }
          } else {
            streakDays = 1
          }

          return {
            choices: newChoices,
            userProfile: {
              ...state.userProfile,
              lastChoiceDate: today,
              totalChoices: state.userProfile.totalChoices + (existingIndex >= 0 ? 0 : 1),
              streakDays,
            },
          }
        })
      },

      addAction: (action: ActionRecord) => {
        set((state) => {
          const today = format(new Date(), 'yyyy-MM-dd')
          const existingIndex = state.actions.findIndex((a) => a.date === today)
          const newActions =
            existingIndex >= 0
              ? state.actions.map((a, i) => (i === existingIndex ? action : a))
              : [...state.actions, action]

          const totalActions =
            action.status === 'completed'
              ? state.userProfile.totalActions + (existingIndex >= 0 ? 0 : 1)
              : state.userProfile.totalActions

          return {
            actions: newActions,
            userProfile: { ...state.userProfile, totalActions },
          }
        })
      },

      updateStreakDays: () => {
        // Called on app load to check if streak is still valid
        set((state) => {
          const today = format(new Date(), 'yyyy-MM-dd')
          const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')
          const lastDate = state.userProfile.lastChoiceDate

          if (lastDate && lastDate !== today && lastDate !== yesterday) {
            return {
              userProfile: { ...state.userProfile, streakDays: 0 },
            }
          }
          return state
        })
      },

      getTodayChoice: () => {
        const today = format(new Date(), 'yyyy-MM-dd')
        return get().choices.find((c) => c.date === today)
      },

      getTodayAction: () => {
        const today = format(new Date(), 'yyyy-MM-dd')
        return get().actions.find((a) => a.date === today)
      },
    }),
    {
      name: 'value-selector-storage',
    }
  )
)
