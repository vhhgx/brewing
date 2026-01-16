<template>
  <div class="record-detail min-h-screen bg-gray-50">
    <Header :title="recipeName || '记录详情'" show-back />

    <div v-if="record" class="p-4 space-y-6 pb-24">
      <!-- 冲煮信息 -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <span class="text-xl">☕</span>
          <span>冲煮信息</span>
        </h3>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs mb-1">日期</span>
            <span class="font-semibold text-gray-800">{{ formatDate(record.timestamp) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs mb-1">方案</span>
            <span class="font-semibold text-gray-800">{{ recipeName }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs mb-1">粉量</span>
            <span class="font-semibold text-gray-800">{{ record.actualParameters.coffeeWeight }}g</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs mb-1">水量</span>
            <span class="font-semibold text-gray-800">{{ record.actualParameters.waterWeight }}g</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs mb-1">水温</span>
            <span class="font-semibold text-gray-800">{{ record.actualParameters.temperature }}℃</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs mb-1">时长</span>
            <span class="font-semibold text-gray-800">{{ formatTime(record.actualParameters.totalTime) }}</span>
          </div>
        </div>
      </Card>

      <!-- 整体评分 -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <span class="text-xl">⭐</span>
          <span>整体评分</span>
        </h3>
        <div class="flex items-center justify-center py-2">
          <StarRating :model-value="record.tastingNotes.overallScore" :max="5" readonly />
          <span class="ml-3 text-2xl font-bold text-amber-600">
            {{ record.tastingNotes.overallScore }}/5
          </span>
        </div>
      </Card>

      <!-- 风味标签 -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <span class="text-xl">🎨</span>
          <span>风味特征</span>
        </h3>
        <div v-if="record.tastingNotes.flavorTags.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="(tag, index) in record.tastingNotes.flavorTags"
            :key="index"
            class="px-3 py-1.5 rounded-full text-sm font-medium"
            :style="{ backgroundColor: getFlavorColor(tag) + '20', color: getFlavorColor(tag) }"
          >
            {{ tag }}
          </span>
        </div>
        <div v-else class="text-center text-gray-400 py-4">
          未记录风味特征
        </div>
      </Card>

      <!-- 维度评分 -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
          <span class="text-xl">📊</span>
          <span>维度评分</span>
        </h3>
        <div class="space-y-4">
          <div
            v-for="dim in dimensions"
            :key="dim.key"
            class="dimension-item"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span class="text-lg">{{ dim.icon }}</span>
                <span>{{ dim.label }}</span>
              </span>
              <span class="text-lg font-bold px-2 py-1 rounded" :style="{ color: dim.color }">
                {{ record.tastingNotes.dimensions[dim.key] }}
              </span>
            </div>

            <!-- 可视化进度条 -->
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :style="{
                  width: `${(record.tastingNotes.dimensions[dim.key] / 5) * 100}%`,
                  backgroundColor: dim.color
                }"
              />
            </div>

            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>弱</span>
              <span>中</span>
              <span>强</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- 品鉴笔记 -->
      <Card v-if="record.tastingNotes.notes" padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <span class="text-xl">📝</span>
          <span>品鉴笔记</span>
        </h3>
        <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {{ record.tastingNotes.notes }}
        </p>
      </Card>

      <!-- 步骤完成情况 -->
      <Card v-if="record.actualParameters.stepsCompleted" padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <span class="text-xl">✓</span>
          <span>步骤完成情况</span>
        </h3>
        <div class="space-y-2">
          <div
            v-for="step in record.actualParameters.stepsCompleted"
            :key="step.stepId"
            class="flex items-center gap-3 p-2 bg-green-50 rounded-lg"
          >
            <div class="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full text-xs font-bold">
              ✓
            </div>
            <div class="flex-1 text-sm">
              <span class="font-medium text-gray-800">步骤 {{ step.stepId + 1 }}</span>
              <span class="text-gray-500 ml-2">
                实际用时: {{ step.actualDuration }}s
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-center text-gray-400">
        <p class="mb-4">未找到记录</p>
        <Button variant="primary" @click="router.push('/history')">
          返回历史
        </Button>
      </div>
    </div>

    <!-- 操作按钮 - 固定在底部 -->
    <div v-if="record" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
      <div class="flex gap-3">
        <Button
          variant="primary"
          size="large"
          class="flex-1"
          @click="repeatBrew"
        >
          <span class="flex items-center justify-center gap-2">
            <span>再来一次</span>
            <span>🔄</span>
          </span>
        </Button>
        <Button
          variant="outline"
          size="large"
          @click="editRecord"
        >
          <span class="flex items-center justify-center gap-1">
            <span>编辑</span>
            <span>✏️</span>
          </span>
        </Button>
        <Button
          variant="danger"
          size="large"
          @click="confirmDelete"
        >
          <span class="flex items-center justify-center gap-1">
            <span>删除</span>
            <span>🗑️</span>
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTastingStore } from '@/stores/tastingStore'
import { useRecipeStore } from '@/stores/recipeStore'
import Header from '@/components/ui/layout/Header.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import StarRating from '@/components/ui/StarRating.vue'

const router = useRouter()
const route = useRoute()
const tastingStore = useTastingStore()
const recipeStore = useRecipeStore()

const record = computed(() => tastingStore.getRecordById(route.params.id))

const recipeName = computed(() => {
  return recipeStore.getRecipeById(record.value?.linkedRecipeId)?.name || '未知方案'
})

// 维度配置
const dimensions = [
  { key: 'aroma', label: '香气', icon: '👃', color: '#FF6B6B' },
  { key: 'body', label: '醇厚度', icon: '🫗', color: '#4ECDC4' },
  { key: 'acidity', label: '酸度', icon: '🍋', color: '#FFE66D' },
  { key: 'sweetness', label: '甜度', icon: '🍯', color: '#FFB6C1' },
  { key: 'aftertaste', label: '余韵', icon: '✨', color: '#A8E6CF' }
]

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getFlavorColor(flavor) {
  const colorMap = {
    '果香': '#FF6B6B',
    '花香': '#FFB6C1',
    '坚果': '#A0826D',
    '巧克力': '#6F4E37',
    '焦糖': '#FFD700',
    '柑橘': '#FFA500',
    '莓果': '#8B008B',
    '热带水果': '#FF69B4',
    '茉莉': '#E6E6FA',
    '甜感': '#FFE4E1',
    '醇厚': '#8B4513',
    '明亮': '#FFD700'
  }
  return colorMap[flavor] || '#999999'
}

function repeatBrew() {
  if (!record.value) return
  const recipe = recipeStore.getRecipeById(record.value.linkedRecipeId)
  if (recipe) {
    router.push({
      name: 'Brewing',
      params: { recipeId: recipe.recipeId }
    })
  }
}

function editRecord() {
  router.push({
    name: 'TastingNotes',
    params: { recordId: record.value.brewRecordId }
  })
}

function confirmDelete() {
  if (confirm('确定要删除这条记录吗？此操作无法撤销。')) {
    tastingStore.deleteRecord(record.value.brewRecordId)
    router.push('/history')
  }
}
</script>
