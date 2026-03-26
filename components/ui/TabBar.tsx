'use client'

import Link from 'next/link'
import { Home, Compass, Settings } from 'lucide-react'

interface TabBarProps {
  activeTab: 'home' | 'compass' | 'settings'
}

const tabs = [
  { id: 'home', label: '首页', icon: Home, href: '/' },
  { id: 'compass', label: '罗盘', icon: Compass, href: '/compass' },
  { id: 'settings', label: '设置', icon: Settings, href: '/settings' },
] as const

export default function TabBar({ activeTab }: TabBarProps) {
  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white/90 backdrop-blur-sm safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
                isActive ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={`text-xs font-medium ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
