<template>
  <div class="history-view min-h-screen bg-gray-50">
    <Header title="历史记录" />

    <div class="p-4 pb-20">
      <!-- 记录列表 -->
      <div v-if="records.length > 0" class="space-y-3">
        <Card
          v-for="record in records"
          :key="record.brewRecordId"
          clickable
          hoverable
          padding="normal"
          shadow="normal"
          @click="viewDetail(record.brewRecordId)"
          class="transition-all hover:shadow-lg"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <!-- 方案名称 -->
              <h3 class="font-bold text-lg mb-1 text-gray-800">
                {{ getRecipeName(record.linkedRecipeId) }}
              </h3>

              <!-- 日期时间 -->
              <div class="text-xs text-gray-500 mb-3 flex items-center gap-2">
                <span>📅</span>
                <span>{{ formatDate(record.timestamp) }}</span>
              </div>

              <!-- 评分 -->
              <div class="flex items-center gap-3 mb-3">
                <StarRating
                  :model-value="record.tastingNotes.overallScore"
                  :max="5"
                  readonly
                  class="scale-90"
                />
                <span class="text-sm font-semibold text-amber-600">
                  {{ record.tastingNotes.overallScore }}/5
                </span>
              </div>

              <!-- 风味标签 -->
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(tag, index) in record.tastingNotes.flavorTags.slice(0, 4)"
                  :key="index"
                  class="px-2 py-0.5 text-xs rounded-full font-medium"
                  :style="{ backgroundColor: getFlavorColor(tag) + '20', color: getFlavorColor(tag) }"
                >
                  {{ tag }}
                </span>
                <span
                  v-if="record.tastingNotes.flavorTags.length > 4"
                  class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
                >
                  +{{ record.tastingNotes.flavorTags.length - 4 }}
                </span>
              </div>

              <!-- 冲煮参数摘要 -->
              <div class="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                <span>{{ record.actualParameters.coffeeWeight }}g</span>
                <span>•</span>
                <span>{{ record.actualParameters.waterWeight }}g</span>
                <span>•</span>
                <span>{{ formatTime(record.actualParameters.totalTime) }}</span>
              </div>
            </div>

            <!-- 再来一次按钮 -->
            <Button
              size="small"
              variant="outline"
              @click.stop="repeatBrew(record)"
              class="flex-shrink-0"
            >
              <span class="flex items-center gap-1">
                <span>再来一次</span>
                <span class="text-sm">🔄</span>
              </span>
            </Button>
          </div>
        </Card>
      </div>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4">☕</div>
        <p class="text-gray-400 mb-6 text-center">
          还没有冲煮记录<br />
          <span class="text-sm">开始你的第一次手冲吧！</span>
        </p>
        <Button variant="primary" @click="router.push('/')">
          <span class="flex items-center gap-2">
            <span>开始冲煮</span>
            <span>→</span>
          </span>
        </Button>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <TabBar />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTastingStore } from '@/stores/tastingStore'
import { useRecipeStore } from '@/stores/recipeStore'
import Header from '@/components/ui/layout/Header.vue'
import TabBar from '@/components/ui/layout/TabBar.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import StarRating from '@/components/ui/StarRating.vue'

const router = useRouter()
const tastingStore = useTastingStore()
const recipeStore = useRecipeStore()

const records = computed(() => tastingStore.getAllRecords)

function getRecipeName(recipeId) {
  return recipeStore.getRecipeById(recipeId)?.name || '未知方案'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
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

function viewDetail(recordId) {
  router.push({
    name: 'RecordDetail',
    params: { id: recordId }
  })
}

function repeatBrew(record) {
  const recipe = recipeStore.getRecipeById(record.linkedRecipeId)
  if (recipe) {
    router.push({
      name: 'Brewing',
      params: { recipeId: recipe.recipeId }
    })
  }
}
</script>
