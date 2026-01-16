<template>
  <div class="profile-view min-h-screen bg-gray-50">
    <Header title="个人中心" />

    <div class="p-4 space-y-4 pb-20">
      <!-- 用户信息卡片 -->
      <Card padding="large" shadow="normal" class="bg-gradient-to-br from-amber-50 to-orange-50">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-3xl">
            ☕
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold text-gray-800 mb-1">咖啡爱好者</h2>
            <p class="text-sm text-gray-600">探索手冲咖啡的艺术</p>
          </div>
        </div>
      </Card>

      <!-- 统计信息 -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-4 text-gray-800">我的统计</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-amber-600 mb-1">{{ totalRecords }}</div>
            <div class="text-xs text-gray-500">冲煮次数</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ averageScore }}</div>
            <div class="text-xs text-gray-500">平均评分</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-1">{{ totalDays }}</div>
            <div class="text-xs text-gray-500">冲煮天数</div>
          </div>
        </div>
      </Card>

      <!-- 功能列表 -->
      <Card padding="none" shadow="normal">
        <div class="divide-y divide-gray-100">
          <!-- 我的收藏 -->
          <button
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            @click="router.push('/')"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">📚</span>
              <span class="font-medium text-gray-800">我的方案</span>
            </div>
            <span class="text-gray-400">→</span>
          </button>

          <!-- 历史记录 -->
          <button
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            @click="router.push('/history')"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">📖</span>
              <span class="font-medium text-gray-800">历史记录</span>
            </div>
            <span class="text-gray-400">→</span>
          </button>

          <!-- 数据统计 -->
          <button
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            disabled
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">📊</span>
              <span class="font-medium text-gray-400">数据统计</span>
              <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">即将推出</span>
            </div>
          </button>
        </div>
      </Card>

      <!-- 设置 -->
      <Card padding="none" shadow="normal">
        <div class="divide-y divide-gray-100">
          <!-- 通知设置 -->
          <div class="px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🔔</span>
              <span class="font-medium text-gray-800">通知提醒</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="notificationsEnabled"
                type="checkbox"
                class="sr-only peer"
                @change="toggleNotifications"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <!-- 振动反馈 -->
          <div class="px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📳</span>
              <span class="font-medium text-gray-800">振动反馈</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="vibrationEnabled"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <!-- 声音提示 -->
          <div class="px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🔊</span>
              <span class="font-medium text-gray-800">声音提示</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="soundEnabled"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <!-- 关于 -->
      <Card padding="none" shadow="normal">
        <div class="divide-y divide-gray-100">
          <button
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            @click="showAbout = true"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">ℹ️</span>
              <span class="font-medium text-gray-800">关于应用</span>
            </div>
            <span class="text-gray-400">→</span>
          </button>

          <!-- 清除数据 -->
          <button
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors"
            @click="confirmClearData"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">🗑️</span>
              <span class="font-medium text-red-600">清除所有数据</span>
            </div>
          </button>
        </div>
      </Card>

      <!-- 版本信息 -->
      <div class="text-center text-xs text-gray-400 py-4">
        <p>手冲咖啡助手 v2.0</p>
        <p class="mt-1">用心冲煮每一杯咖啡 ☕</p>
      </div>
    </div>

    <!-- 关于应用弹窗 -->
    <Modal v-model="showAbout" title="关于应用">
      <div class="space-y-4 text-sm text-gray-700">
        <div class="text-center">
          <div class="text-6xl mb-3">☕</div>
          <h3 class="text-xl font-bold mb-2">手冲咖啡助手</h3>
          <p class="text-gray-500">版本 2.0.0</p>
        </div>

        <div class="pt-4 border-t border-gray-200">
          <h4 class="font-semibold mb-2">功能特性</h4>
          <ul class="space-y-1 text-xs">
            <li>• 精准计时器，误差小于 0.1 秒</li>
            <li>• 预设经典冲煮方案</li>
            <li>• 多维度品鉴记录系统</li>
            <li>• 冲煮历史追踪与分析</li>
            <li>• 声音、振动、通知提醒</li>
          </ul>
        </div>

        <div class="pt-4 border-t border-gray-200">
          <h4 class="font-semibold mb-2">开发信息</h4>
          <p class="text-xs text-gray-600">
            基于 Vue 3 + Vite + Tailwind CSS 开发<br/>
            使用 Pinia 进行状态管理<br/>
            支持数据本地持久化
          </p>
        </div>
      </div>

      <template #footer>
        <Button variant="primary" @click="showAbout = false" class="w-full">
          知道了
        </Button>
      </template>
    </Modal>

    <!-- 底部导航栏 -->
    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTastingStore } from '@/stores/tastingStore'
import { useBrewingStore } from '@/stores/brewingStore'
import Header from '@/components/ui/layout/Header.vue'
import TabBar from '@/components/ui/layout/TabBar.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'

const router = useRouter()
const tastingStore = useTastingStore()
const brewingStore = useBrewingStore()

const showAbout = ref(false)
const notificationsEnabled = ref(false)
const vibrationEnabled = ref(true)
const soundEnabled = ref(true)

// 统计数据
const totalRecords = computed(() => tastingStore.records.length)

const averageScore = computed(() => {
  if (totalRecords.value === 0) return '0.0'
  const sum = tastingStore.records.reduce((acc, r) => acc + r.tastingNotes.overallScore, 0)
  return (sum / totalRecords.value).toFixed(1)
})

const totalDays = computed(() => {
  if (totalRecords.value === 0) return 0
  const dates = tastingStore.records.map(r => new Date(r.timestamp).toDateString())
  const uniqueDates = new Set(dates)
  return uniqueDates.size
})

async function toggleNotifications() {
  if (notificationsEnabled.value) {
    const granted = await brewingStore.requestNotificationPermission()
    if (!granted) {
      notificationsEnabled.value = false
      alert('通知权限未授予')
    }
  }
}

function confirmClearData() {
  if (confirm('确定要清除所有数据吗？此操作无法撤销！')) {
    if (confirm('再次确认：这将删除所有冲煮记录和自定义方案')) {
      // 清除所有数据
      localStorage.clear()
      sessionStorage.clear()
      alert('数据已清除，页面即将刷新')
      window.location.reload()
    }
  }
}
</script>
