<template>
  <div class="tasting-notes min-h-screen bg-gray-50">
    <Header title="品鉴记录" show-back />

    <div v-if="record" class="p-4 space-y-6 pb-24">
      <!-- 冲煮参数（只读） -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <span class="text-xl">☕</span>
          <span>本次冲煮</span>
        </h3>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs">方案</span>
            <span class="font-semibold text-gray-800">{{ recipeName }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs">粉量</span>
            <span class="font-semibold text-gray-800">{{ record.actualParameters.coffeeWeight }}g</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs">水量</span>
            <span class="font-semibold text-gray-800">{{ record.actualParameters.waterWeight }}g</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-xs">时长</span>
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
        <div class="flex items-center justify-center py-4">
          <StarRating v-model="record.tastingNotes.overallScore" :max="5" />
        </div>
      </Card>

      <!-- 快捷风味标签 -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <span class="text-xl">🎨</span>
          <span>风味特征</span>
        </h3>

        <!-- 已选标签 -->
        <div v-if="selectedFlavors.length > 0" class="mb-4">
          <div class="text-xs text-gray-500 mb-2">已选择:</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tag, index) in selectedFlavors"
              :key="index"
              class="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1"
              :style="{ backgroundColor: getFlavorColor(tag) + '20', color: getFlavorColor(tag) }"
            >
              {{ tag }}
              <button @click="removeFlavor(tag)" class="ml-1 hover:opacity-70">
                <span class="text-xs">✕</span>
              </button>
            </span>
          </div>
        </div>

        <!-- 快捷选择 -->
        <div>
          <div class="text-xs text-gray-500 mb-2">快捷选择:</div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="flavor in quickFlavors"
              :key="flavor.name"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="selectedFlavors.includes(flavor.name)
                ? 'bg-amber-100 text-amber-800 border-2 border-amber-400'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'"
              @click="toggleFlavor(flavor.name)"
            >
              <div class="text-lg mb-1">{{ flavor.icon }}</div>
              <div>{{ flavor.name }}</div>
            </button>
          </div>
        </div>

        <!-- 自定义风味 -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="text-xs text-gray-500 mb-2">自定义风味:</div>
          <div class="flex gap-2">
            <input
              v-model="customFlavor"
              type="text"
              placeholder="输入其他风味..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              @keyup.enter="addCustomFlavor"
            />
            <Button size="small" @click="addCustomFlavor">添加</Button>
          </div>
        </div>
      </Card>

      <!-- 维度评分（简化版滑块） -->
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
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span class="text-lg">{{ dim.icon }}</span>
                <span>{{ dim.label }}</span>
              </label>
              <span class="text-lg font-bold px-2 py-1 rounded" :style="{ color: dim.color }">
                {{ record.tastingNotes.dimensions[dim.key] }}
              </span>
            </div>

            <input
              v-model.number="record.tastingNotes.dimensions[dim.key]"
              type="range"
              min="1"
              max="5"
              step="0.5"
              class="w-full h-2 rounded-lg appearance-none cursor-pointer"
              :style="{
                background: `linear-gradient(to right, ${dim.color} 0%, ${dim.color} ${((record.tastingNotes.dimensions[dim.key] - 1) / 4) * 100}%, #E5E7EB ${((record.tastingNotes.dimensions[dim.key] - 1) / 4) * 100}%, #E5E7EB 100%)`
              }"
            />

            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>弱</span>
              <span>中</span>
              <span>强</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- 自定义笔记 -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <span class="text-xl">📝</span>
          <span>品鉴笔记</span>
        </h3>
        <textarea
          v-model="record.tastingNotes.notes"
          rows="4"
          class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          placeholder="记录你的感受、发现和改进想法..."
        />
      </Card>
    </div>

    <!-- 保存按钮 - 固定在底部 -->
    <div v-if="record" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
      <Button
        variant="primary"
        size="large"
        class="w-full text-lg font-semibold"
        @click="saveRecord"
      >
        <span class="flex items-center justify-center gap-2">
          <span>保存记录</span>
          <span class="text-xl">✓</span>
        </span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBrewingStore } from '@/stores/brewingStore'
import { useTastingStore } from '@/stores/tastingStore'
import { useRecipeStore } from '@/stores/recipeStore'
import Header from '@/components/ui/layout/Header.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import StarRating from '@/components/ui/StarRating.vue'

const router = useRouter()
const route = useRoute()
const brewingStore = useBrewingStore()
const tastingStore = useTastingStore()
const recipeStore = useRecipeStore()

const record = ref(null)
const customFlavor = ref('')

// 快捷风味标签
const quickFlavors = [
  { name: '果香', icon: '🍎' },
  { name: '花香', icon: '🌸' },
  { name: '坚果', icon: '🌰' },
  { name: '巧克力', icon: '🍫' },
  { name: '焦糖', icon: '🍯' },
  { name: '柑橘', icon: '🍊' },
  { name: '莓果', icon: '🫐' },
  { name: '热带水果', icon: '🥭' },
  { name: '茉莉', icon: '🌼' },
  { name: '甜感', icon: '🍬' },
  { name: '醇厚', icon: '☕' },
  { name: '明亮', icon: '✨' }
]

// 维度配置
const dimensions = [
  { key: 'aroma', label: '香气', icon: '👃', color: '#FF6B6B' },
  { key: 'body', label: '醇厚度', icon: '🫗', color: '#4ECDC4' },
  { key: 'acidity', label: '酸度', icon: '🍋', color: '#FFE66D' },
  { key: 'sweetness', label: '甜度', icon: '🍯', color: '#FFB6C1' },
  { key: 'aftertaste', label: '余韵', icon: '✨', color: '#A8E6CF' }
]

const selectedFlavors = computed({
  get: () => record.value?.tastingNotes.flavorTags || [],
  set: (val) => {
    if (record.value) {
      record.value.tastingNotes.flavorTags = val
    }
  }
})

const recipeName = computed(() => {
  return recipeStore.getRecipeById(record.value?.linkedRecipeId)?.name || ''
})

onMounted(() => {
  console.log('🔍 TastingNotesView mounted, recordId:', route.params.recordId)
  
  if (route.params.recordId === 'new') {
    // 从 brewingStore 创建新记录
    console.log('📝 Creating new record from brewing data')
    console.log('brewingStore.brewRecord:', brewingStore.brewRecord)
    console.log('brewingStore.totalElapsedTime:', brewingStore.totalElapsedTime)
    
    const brewData = {
      recipeId: brewingStore.brewRecord?.recipeId || brewingStore.currentRecipe?.recipeId,
      actualParameters: {
        coffeeWeight: brewingStore.brewRecord?.actualParameters?.coffeeWeight || brewingStore.currentRecipe?.coffeeWeight,
        totalWater: brewingStore.brewRecord?.actualParameters?.totalWater || brewingStore.currentRecipe?.totalWater,
        temperature: brewingStore.brewRecord?.actualParameters?.temperature || brewingStore.currentRecipe?.temperature,
        totalTime: brewingStore.totalElapsedTime
      },
      actualSteps: brewingStore.brewRecord?.actualSteps || [],
      totalTime: brewingStore.totalElapsedTime
    }
    
    console.log('📦 brewData:', brewData)
    record.value = tastingStore.createRecord(brewData)
    console.log('✅ Record created:', record.value)
  } else {
    // 加载已有记录
    console.log('📖 Loading existing record:', route.params.recordId)
    record.value = tastingStore.getRecordById(route.params.recordId)
  }
})

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

function toggleFlavor(flavor) {
  const index = selectedFlavors.value.indexOf(flavor)
  if (index > -1) {
    selectedFlavors.value.splice(index, 1)
  } else {
    selectedFlavors.value.push(flavor)
  }
}

function removeFlavor(flavor) {
  const index = selectedFlavors.value.indexOf(flavor)
  if (index > -1) {
    selectedFlavors.value.splice(index, 1)
  }
}

function addCustomFlavor() {
  if (customFlavor.value.trim() && !selectedFlavors.value.includes(customFlavor.value.trim())) {
    selectedFlavors.value.push(customFlavor.value.trim())
    customFlavor.value = ''
  }
}

function saveRecord() {
  console.log('💾 Saving record:', record.value)
  tastingStore.updateRecord(record.value.brewRecordId, record.value)
  console.log('✅ Record saved, all records:', tastingStore.records)
  router.push('/history')
}
</script>

<style scoped>
/* 自定义滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 3px solid currentColor;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 3px solid currentColor;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
