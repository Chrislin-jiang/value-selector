'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Trash2, Info } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import TabBar from '@/components/ui/TabBar'

export default function SettingsPage() {
  const router = useRouter()
  const { userProfile, choices, actions } = useAppStore()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      userProfile,
      choices,
      actions,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `value-selector-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8] pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-6">
        <button
          onClick={() => router.push('/')}
          className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">设置</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* About */}
        <motion.div
          className="rounded-2xl bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🌱</span>
            <div>
              <h2 className="font-bold text-gray-800">价值选择器</h2>
              <p className="text-sm text-gray-400">MVP v0.1</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            每天一个选择，一个微行动——帮你活成自己认同的人。
            基于 ACT 接纳承诺疗法和积极心理学设计。
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="rounded-2xl bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" /> 我的数据
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>加入时间</span>
              <span className="text-gray-400">
                {new Date(userProfile.firstVisit).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>累计选择</span>
              <span className="text-gray-400">{userProfile.totalChoices} 次</span>
            </div>
            <div className="flex justify-between">
              <span>完成行动</span>
              <span className="text-gray-400">{userProfile.totalActions} 次</span>
            </div>
            <div className="flex justify-between">
              <span>最长连续</span>
              <span className="text-gray-400">{userProfile.streakDays} 天</span>
            </div>
          </div>
        </motion.div>

        {/* Export */}
        <motion.div
          className="rounded-2xl bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={handleExport}
            className="flex w-full items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Download className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium text-gray-700">导出我的数据</p>
              <p className="text-xs text-gray-400">下载 JSON 格式的完整记录</p>
            </div>
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          className="rounded-2xl bg-amber-50 p-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-amber-700 leading-relaxed">
            ⚠️ 本应用不替代专业心理咨询。如果你正在经历严重的心理困扰，
            请联系专业人士或拨打心理援助热线：<strong>400-161-9995</strong>
          </p>
        </motion.div>
      </div>

      <TabBar activeTab="settings" />
    </div>
  )
}
