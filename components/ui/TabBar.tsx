'use client'

import Link from 'next/link'
import { Home, Compass, BookOpen, Users } from 'lucide-react'

type TabId = 'home' | 'compass' | 'journal' | 'community'

interface TabBarProps {
  activeTab: TabId
}

interface Tab {
  id: TabId
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>
  href: string
  available: boolean
}

const tabs: Tab[] = [
  { id: 'home',      label: '首页', icon: Home,     href: '/',          available: true  },
  { id: 'compass',   label: '罗盘', icon: Compass,  href: '/compass',   available: true  },
  { id: 'journal',   label: '日记', icon: BookOpen, href: '/journal',   available: false },
  { id: 'community', label: '社区', icon: Users,    href: '/community', available: false },
]

export default function TabBar({ activeTab }: TabBarProps) {
  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-gray-100/80 bg-white/90 backdrop-blur-md">
      <div className="flex items-center px-2 pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          if (!tab.available) {
            return (
              <div
                key={tab.id}
                className="flex flex-1 cursor-not-allowed select-none flex-col items-center gap-0.5 py-2.5 opacity-25"
                title="即将开放"
              >
                <Icon className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
                <span className="text-[10px] text-gray-400">{tab.label}</span>
              </div>
            )
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-colors ${
                isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative flex flex-col items-center gap-0.5">
                {/* 激活指示点 */}
                {isActive && (
                  <span className="absolute -top-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gray-800" />
                )}
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
              </div>
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
