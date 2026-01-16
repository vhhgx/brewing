<template>
  <div class="brewing-config min-h-screen bg-gray-50">
    <Header title="准备冲煮" show-back />

    <div v-if="recipe" class="p-4 space-y-6 pb-24">
      <!-- 方案预览 -->
      <Card padding="normal" shadow="large" class="bg-gradient-to-br from-amber-50 to-orange-50">
        <h2 class="text-2xl font-bold mb-4 text-amber-900">{{ recipe.name }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="param-preview">
            <div class="text-xs text-gray-500 mb-1">咖啡粉</div>
            <div class="text-xl font-bold text-amber-700">{{ recipe.coffeeWeight }}g</div>
          </div>
          <div class="param-preview">
            <div class="text-xs text-gray-500 mb-1">水量</div>
            <div class="text-xl font-bold text-blue-600">{{ recipe.totalWater }}g</div>
          </div>
          <div class="param-preview">
            <div class="text-xs text-gray-500 mb-1">水温</div>
            <div class="text-xl font-bold text-red-500">{{ recipe.temperature }}℃</div>
          </div>
          <div class="param-preview">
            <div class="text-xs text-gray-500 mb-1">研磨度</div>
            <div class="text-base font-semibold text-gray-700">{{ recipe.grindSizeDesc }}</div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-amber-200">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">器具: {{ recipe.device }}</span>
            <span class="text-gray-600">粉水比: {{ recipe.ratio }}</span>
          </div>
        </div>
      </Card>

      <!-- 准备清单 -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
          <span class="text-xl">📋</span>
          <span>准备清单</span>
        </h3>
        <ul class="space-y-3">
          <li
            v-for="(item, index) in checklist"
            :key="index"
            class="flex items-start gap-3 p-2 rounded hover:bg-gray-50 transition-colors"
          >
            <input
              v-model="item.checked"
              type="checkbox"
              class="w-5 h-5 mt-0.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <span class="flex-1 text-sm leading-relaxed" :class="{ 'line-through text-gray-400': item.checked }">
              {{ item.text }}
            </span>
          </li>
        </ul>
      </Card>

      <!-- 步骤预览 -->
      <Card padding="normal" shadow="normal">
        <h3 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
          <span class="text-xl">🔄</span>
          <span>步骤预览</span>
        </h3>
        <div class="space-y-2">
          <div
            v-for="step in recipe.steps"
            :key="step.stepId"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full font-bold text-sm">
              {{ step.stepId + 1 }}
            </div>
            <div class="flex-1">
              <div class="font-semibold text-sm text-gray-800">{{ step.name }}</div>
              <div class="text-xs text-gray-500">
                {{ step.waterAmount > 0 ? `${step.waterAmount}g` : '等待' }} · {{ step.duration }}s
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 提示信息 -->
      <Card padding="normal" shadow="small" class="bg-blue-50 border border-blue-200">
        <div class="flex gap-3">
          <span class="text-2xl">💡</span>
          <div class="flex-1">
            <h4 class="font-semibold text-sm text-blue-900 mb-1">温馨提示</h4>
            <ul class="text-xs text-blue-700 space-y-1">
              <li>• 确保所有器具已预热并润湿滤纸</li>
              <li>• 咖啡粉研磨后尽快冲煮，保持新鲜度</li>
              <li>• 建议开启声音提醒以便及时注水</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-center text-gray-400">
        <p class="mb-4">未找到方案</p>
        <Button variant="primary" @click="router.push('/')">
          返回首页
        </Button>
      </div>
    </div>

    <!-- 开始计时按钮 - 固定在底部 -->
    <div v-if="recipe" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
      <Button
        variant="primary"
        size="large"
        class="w-full text-lg font-bold"
        :disabled="!allChecked"
        @click="startBrewing"
      >
        <span class="flex items-center justify-center gap-2">
          <span v-if="!allChecked">请完成准备清单</span>
          <span v-else>开始计时</span>
          <span class="text-xl">⏱</span>
        </span>
      </Button>
      <div v-if="!allChecked" class="text-center text-xs text-gray-500 mt-2">
        已完成 {{ checkedCount }}/{{ checklist.length }} 项
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipeStore } from '@/stores/recipeStore'
import { useBrewingStore } from '@/stores/brewingStore'
import Header from '@/components/ui/layout/Header.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()
const brewingStore = useBrewingStore()

const recipe = computed(() => recipeStore.getRecipeById(route.params.recipeId))

// 准备清单
const checklist = ref([
  { text: `准备好咖啡豆（${recipe.value?.coffeeWeight || 0}g）`, checked: false },
  { text: `烧水至 ${recipe.value?.temperature || 0}℃`, checked: false },
  { text: `研磨咖啡豆至${recipe.value?.grindSizeDesc || '中细研磨'}`, checked: false },
  { text: '润湿滤纸并预热器具', checked: false },
  { text: '准备电子秤并归零', checked: false }
])

const allChecked = computed(() => checklist.value.every(item => item.checked))
const checkedCount = computed(() => checklist.value.filter(item => item.checked).length)

function startBrewing() {
  if (!allChecked.value) {
    alert('请先完成所有准备工作')
    return
  }

  // 请求通知权限
  brewingStore.requestNotificationPermission()

  // 启动冲煮
  brewingStore.startBrewing(recipe.value)

  // 返回首页（TODO: 展开 Bottom Sheet）
  router.push('/')
}
</script>

<style scoped>
.param-preview {
  @apply transition-transform hover:scale-105;
}
</style>
